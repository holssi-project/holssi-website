use chrono::{DateTime, Utc};
use edgedb_derive::Queryable;
use edgedb_protocol::model::Datetime;
use serde::Serialize;
use uuid::Uuid;

#[derive(Queryable)]
pub(crate) struct ProjectQuery {
    id: Uuid,
    created: Datetime,
    status: ProjectStatus,
}

#[derive(Serialize)]
pub(crate) struct Project {
    id: Uuid,
    created: DateTime<Utc>,
    status: ProjectStatus,
}
impl From<ProjectQuery> for Project {
    fn from(value: ProjectQuery) -> Self {
        Self {
            id: value.id,
            created: value.created.into(),
            status: value.status,
        }
    }
}

#[derive(Serialize, Queryable)]
pub(crate) enum ProjectStatus {
    Created,
    Uploaded,
    Building,
    Finished,
}
