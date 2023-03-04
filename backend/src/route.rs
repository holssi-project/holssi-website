use std::sync::Arc;

use axum::{
    extract::{Multipart, Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{
    common::AppRes,
    file::File,
    nonce::Nonce,
    project::{ProjectSimple, ProjectStatus},
    AppState, Result,
};

pub(crate) async fn create(
    State(state): State<Arc<AppState>>,
) -> Result<Json<AppRes<ProjectSimple>>> {
    let result = state.db.insert_project().await?;
    Ok(AppRes::success(result))
}

pub(crate) async fn upload_ent(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    mut multipart: Multipart,
) -> Result<Response> {
    if let Some(field) = multipart.next_field().await? {
        match (field.name(), field.file_name()) {
            (Some("file"), Some(file_name)) => {
                if !file_name.ends_with(".ent") {
                    return Ok(
                        (StatusCode::BAD_REQUEST, AppRes::fail("wrong file")).into_response()
                    );
                }

                let initial_project = state.db.select_project_simple(&id).await?;
                if *initial_project.status() != ProjectStatus::Created {
                    return Ok(
                        (StatusCode::BAD_REQUEST, AppRes::fail("already uploaded")).into_response()
                    );
                }

                let entry = state.db.create_ent_file(&id, file_name).await?;
                let file = File::Entry(entry);

                file.upload(&state.s3, field.bytes().await?.into()).await?;

                let project = state
                    .db
                    .update_project_status(&id, &ProjectStatus::Uploaded)
                    .await?;

                Ok(AppRes::success(project).into_response())
            }
            _ => Ok((StatusCode::BAD_REQUEST, AppRes::fail("no file")).into_response()),
        }
    } else {
        Ok((StatusCode::BAD_REQUEST, "Bad Request").into_response())
    }
}

pub(crate) async fn status(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<AppRes<ProjectSimple>>> {
    let result = state.db.select_project_simple(&id).await?;
    Ok(AppRes::success(result))
}

pub(crate) async fn upload_exe(
    State(state): State<Arc<AppState>>,
    Query(Nonce { nonce: test_nonce }): Query<Nonce>,
    Path(id): Path<Uuid>,
    mut multipart: Multipart,
) -> Result<Response> {
    if let Some(field) = multipart.next_field().await? {
        match (field.name(), field.file_name()) {
            (Some("file"), Some(file_name)) => {
                let project = state.db.select_project_build(&id).await?;

                if project.status == ProjectStatus::Building && project.build_nonce == test_nonce {
                    let executable = state.db.create_exe_file(&id, file_name).await?;
                    let file = File::Executable(executable);

                    file.upload(&state.s3, field.bytes().await?.into()).await?;

                    let _ = state
                        .db
                        .update_project_status(&id, &ProjectStatus::Success)
                        .await?;

                    Ok(AppRes::success(()).into_response())
                } else {
                    Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
                }
            }
            _ => Ok((StatusCode::BAD_REQUEST, AppRes::fail("no file")).into_response()),
        }
    } else {
        Ok((StatusCode::BAD_REQUEST, "Bad Request").into_response())
    }
}

pub(crate) async fn build_failed(
    State(state): State<Arc<AppState>>,
    Query(Nonce { nonce: test_nonce }): Query<Nonce>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    let project = state.db.select_project_build(&id).await?;

    if project.status == ProjectStatus::Building && project.build_nonce == test_nonce {
        state
            .db
            .update_project_status(&id, &ProjectStatus::Failed)
            .await?;
        Ok(AppRes::success(()).into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}
