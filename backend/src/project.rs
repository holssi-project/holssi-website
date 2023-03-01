use chrono::{DateTime, Utc};
use edgedb_derive::Queryable;
use edgedb_protocol::model::Datetime;
use serde::{Deserialize, Serialize};
use strum::Display;
use uuid::Uuid;

use crate::file::FileQuery;

#[derive(Queryable)]
pub(crate) struct ProjectQuery {
    id: Uuid,
    created: Datetime,
    status: ProjectStatus,
    entry_file: Option<FileQuery>,
    executable: Option<FileQuery>,
    exe_nonce: Option<String>,
}

impl ProjectQuery {
    pub(crate) fn status(&self) -> &ProjectStatus {
        &self.status
    }

    pub(crate) fn exe_nonce(&self) -> Option<&String> {
        self.exe_nonce.as_ref()
    }
}

#[derive(Serialize)]
pub(crate) struct ProjectSimple {
    id: Uuid,
    created: DateTime<Utc>,
    status: ProjectStatus,
}

impl ProjectSimple {
    pub(crate) fn status(&self) -> &ProjectStatus {
        &self.status
    }
}
impl From<ProjectQuery> for ProjectSimple {
    fn from(value: ProjectQuery) -> Self {
        Self {
            id: value.id,
            created: value.created.into(),
            status: value.status,
        }
    }
}

#[derive(Serialize, Queryable, PartialEq, Eq, Display)]
pub(crate) enum ProjectStatus {
    Created,
    Uploaded,
    Building,
    Success,
    Failed,
}

#[derive(Deserialize)]
pub(crate) struct ExeNonce {
    pub(crate) nonce: String,
}
