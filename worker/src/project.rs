use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub(crate) struct Project {
    uid: Uuid,
    status: ProjectStatus,
    entry_name: String,
    executable_name: Option<String>,
    created: DateTime<Utc>,
}
impl Project {
    pub(crate) fn new(name: String) -> Project {
        let uid = Uuid::new_v4();
        let status = ProjectStatus::Created;
        let created = Utc::now();
        Project {
            uid,
            status,
            entry_name: name,
            executable_name: None,
            created,
        }
    }
    pub(crate) fn get_key(uid: Uuid) -> String {
        format!("project:{}", uid.to_string())
    }
    pub(crate) fn key(&self) -> String {
        format!("project:{}", self.uid.to_string())
    }

    pub(crate) fn entry_key(&self) -> String {
        format!("{}/entry/{}", self.uid, self.entry_name)
    }

    pub(crate) fn executable_key(&self) -> Option<String> {
        match &self.executable_name {
            Some(name) => Some(format!("{}/executable/{}", self.uid, name)),
            None => None,
        }
    }

    pub(crate) fn uid(&self) -> Uuid {
        self.uid
    }

    pub(crate) fn status(&self) -> &ProjectStatus {
        &self.status
    }

    pub(crate) fn set_status(&mut self, status: ProjectStatus) {
        self.status = status;
    }

    pub(crate) fn set_executable_name(&mut self, executable_name: Option<String>) {
        self.executable_name = executable_name;
    }
}

#[derive(Serialize, Deserialize)]
pub(crate) enum ProjectStatus {
    Created,
    Building,
    Finished,
}
