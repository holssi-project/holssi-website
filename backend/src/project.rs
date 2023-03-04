use chrono::{DateTime, Utc};
use serde::Serialize;

use uuid::Uuid;

pub(crate) struct ProjectBuild {
    pub(crate) status: ProjectStatus,
    pub(crate) build_nonce: String,
}

#[derive(Serialize)]
pub(crate) struct ProjectSimple {
    pub(crate) project_id: Uuid,
    pub(crate) created: DateTime<Utc>,
    pub(crate) status: ProjectStatus,
}

impl ProjectSimple {
    pub(crate) fn status(&self) -> &ProjectStatus {
        &self.status
    }
}

#[derive(Serialize, PartialEq, Eq, sqlx::Type)]
#[sqlx(type_name = "project_status", rename_all = "lowercase")]
pub(crate) enum ProjectStatus {
    Created,
    Uploaded,
    Building,
    Success,
    Failed,
}
