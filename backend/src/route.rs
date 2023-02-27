use std::sync::Arc;

use axum::{
    extract::{Multipart, Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use uuid::Uuid;

use crate::{
    common::{AppRes, ObjectId},
    file::{File, FileQuery},
    project::{Project, ProjectQuery},
    AppState, Result,
};

pub(crate) async fn create(State(state): State<Arc<AppState>>) -> Result<Json<AppRes<ObjectId>>> {
    let result = state
        .db
        .query_required_single::<ObjectId, _>("insert Project;", &())
        .await?;
    Ok(Json(AppRes::success(result)))
}

pub(crate) async fn upload_ent(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
    mut multipart: Multipart,
) -> Result<Response> {
    if let Some(field) = multipart.next_field().await? {
        match (field.name(), field.file_name()) {
            (Some("file"), Some(file_name)) => {
                let file: File = state
                    .db
                    .query_required_single::<FileQuery, _>(
                        r#"
                        select (insert File {
                            name := <str>$0
                        }) { id, created, name };
                        "#,
                        &(file_name,),
                    )
                    .await?
                    .into();

                file.upload(&state.s3, field.bytes().await?.into()).await?;

                let _ = state
                    .db
                    .query_required_single::<ObjectId, _>(
                        r#"
                        update Project
                        filter .id = <uuid>$0
                        set {
                        entry_file := (select File filter .id = <uuid>$1)
                        }
                        "#,
                        &(id, file.id()),
                    )
                    .await?;

                Ok(Json(AppRes::success(())).into_response())
            }
            _ => Ok((StatusCode::BAD_REQUEST, "Bad Request").into_response()),
        }
    } else {
        Ok((StatusCode::BAD_REQUEST, "Bad Request").into_response())
    }
}

pub(crate) async fn status(
    State(state): State<Arc<AppState>>,
    Path(id): Path<Uuid>,
) -> Result<Json<AppRes<Project>>> {
    let result = state
        .db
        .query_required_single::<ProjectQuery, _>(
            "select Project { id, created, status } filter .id = <uuid>$0;",
            &(id,),
        )
        .await?;
    Ok(Json(AppRes::success(result.into())))
}
