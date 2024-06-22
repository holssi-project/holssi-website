use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{
    builder::flyio::RunMachineOption,
    common::AppRes,
    file::File,
    project::{ProjectSimple, ProjectStatus},
    query::{BuildBody, EntPresignedQuery, ExePresignedQuery, NonceQuery},
    AppState, Result,
};

pub(crate) async fn create(State(state): State<AppState>) -> Result<Json<AppRes<ProjectSimple>>> {
    let result = state.db.insert_project().await?;
    Ok(AppRes::success(result))
}

pub(crate) async fn ent_presigned(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(query): Query<EntPresignedQuery>,
) -> Result<Response> {
    if !query.file_name.ends_with(".ent") {
        return Ok((StatusCode::BAD_REQUEST, AppRes::fail("wrong file")).into_response());
    }

    let initial_project = state.db.select_project_simple(&id).await?;
    if *initial_project.status() != ProjectStatus::Created {
        return Ok((StatusCode::BAD_REQUEST, AppRes::fail("already uploaded")).into_response());
    }

    let file = match state.db.select_entry_file(&id).await {
        Ok(entry) => File::Entry(entry),
        Err(_) => {
            let entry = state.db.create_ent_file(&id, &query.file_name).await?;
            File::Entry(entry)
        }
    };

    let presigned = file.get_presigned(&state.s3).await?;

    Ok(AppRes::success(presigned).into_response())
}

pub(crate) async fn ent_upload_complete(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    let project = state.db.select_project_simple(&id).await?;

    if project.status == ProjectStatus::Created {
        let result = state
            .db
            .update_project_status(&id, &ProjectStatus::Uploaded)
            .await?;
        Ok(AppRes::success(result).into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}

pub(crate) async fn status(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Json<AppRes<ProjectSimple>>> {
    let result = state.db.select_project_simple(&id).await?;
    Ok(AppRes::success(result))
}

pub(crate) async fn exe_presigned(
    State(state): State<AppState>,
    Query(query): Query<ExePresignedQuery>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    let project = state.db.select_project_build(&id).await?;

    if project.status == ProjectStatus::Building && project.build_nonce == query.nonce {
        let executable = state.db.create_exe_file(&id, &query.file_name).await?;
        let file = File::Executable(executable);

        let presigned = file.get_presigned(&state.s3).await?;

        Ok(presigned.into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}

pub(crate) async fn build_success(
    State(state): State<AppState>,
    Query(NonceQuery { nonce: test_nonce }): Query<NonceQuery>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    let project = state.db.select_project_build(&id).await?;

    if project.status == ProjectStatus::Building && project.build_nonce == test_nonce {
        state
            .db
            .update_project_status(&id, &ProjectStatus::Success)
            .await?;
        Ok(AppRes::success(()).into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}
pub(crate) async fn build_failed(
    State(state): State<AppState>,
    Query(NonceQuery { nonce: test_nonce }): Query<NonceQuery>,
    Path(id): Path<Uuid>,
    body: String,
) -> Result<Response> {
    let project = state.db.select_project_build(&id).await?;

    if project.status == ProjectStatus::Building && project.build_nonce == test_nonce {
        tracing::error!("building failed (project_id = {}, reason = {})", id, body);
        state
            .db
            .update_project_status(&id, &ProjectStatus::Failed)
            .await?;
        Ok(AppRes::success(()).into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}

pub(crate) async fn build(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Json(build_info): Json<BuildBody>,
) -> Result<Response> {
    let project = state.db.select_project_build(&id).await?;

    if project.status == ProjectStatus::Uploaded {
        let file = state.db.select_entry_file(&id).await?;

        let opt = RunMachineOption::new(build_info, id, project.build_nonce, File::Entry(file));

        state.builder_tx.send(opt).await?;

        let result = state
            .db
            .update_project_status(&id, &ProjectStatus::Building)
            .await?;
        Ok(AppRes::success(result).into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}

pub(crate) async fn executable_download(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
) -> Result<Response> {
    let project = state.db.select_project_build(&id).await?;

    if project.status == ProjectStatus::Success {
        let exe = state.db.select_executable_file(&id).await?;
        let file = File::Executable(exe);
        let url = format!("{}/{}", state.s3_base_url, file.key_url());
        Ok(AppRes::success(url).into_response())
    } else {
        Ok((StatusCode::BAD_REQUEST, AppRes::fail("Bad Request")).into_response())
    }
}
