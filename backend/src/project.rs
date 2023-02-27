use chrono::{DateTime, Utc};
use edgedb_derive::Queryable;
use edgedb_protocol::model::Datetime;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Queryable)]
pub(crate) struct ProjectId {
    pub(crate) id: Uuid,
}

#[derive(Queryable)]
pub(crate) struct ProjectDB {
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
impl From<ProjectDB> for Project {
    fn from(value: ProjectDB) -> Self {
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
    Building,
    Finished,
}
