use serde::Deserialize;
use uuid::Uuid;

use crate::project::ProjectStatus;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct BuildInfo {
    uid: Uuid,
    name: String,
    name_en: String,
    author: String,
    version: String,
    desc: String,
}

impl BuildInfo {
    pub(crate) fn uid(&self) -> Uuid {
        self.uid
    }
}
