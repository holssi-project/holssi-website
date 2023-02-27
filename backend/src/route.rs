use std::sync::Arc;

use axum::{extract::State, Json};

use crate::{
    project::{Project, ProjectDB, ProjectId},
    AppState, Result,
};

pub(crate) async fn create(State(state): State<Arc<AppState>>) -> Result<Json<ProjectId>> {
    let result: ProjectId = state
        .db
        .query_required_single("insert Project;", &())
        .await?;
    Ok(Json(result))
}
pub(crate) async fn status(
    State(state): State<Arc<AppState>>,
    Json(project_id): Json<ProjectId>,
) -> Result<Json<Project>> {
    let result = state
        .db
        .query_required_single::<ProjectDB, _>(
            "select Project { id, created, status } filter .id = <uuid>$0;",
            &(project_id.id,),
        )
        .await?;
    Ok(Json(result.into()))
}
