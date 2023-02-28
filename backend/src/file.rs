use aws_sdk_s3::types::ByteStream;
use chrono::{DateTime, Utc};
use edgedb_derive::Queryable;
use edgedb_protocol::model::Datetime;
use serde::Serialize;
use uuid::Uuid;

use crate::db::DB;

#[derive(Serialize)]
pub(crate) struct File {
    id: Uuid,
    created: DateTime<Utc>,
    name: String,
}
impl File {
    pub(crate) fn key(&self) -> String {
        format!("{}/{}", self.id, self.name)
    }

    pub(crate) async fn new(db: &DB, file_name: &str) -> crate::Result<Self> {
        let file = db.insert_file(file_name).await?.into();
        Ok(file)
    }

    pub(crate) async fn upload(
        &self,
        s3: &aws_sdk_s3::Client,
        body: ByteStream,
    ) -> crate::Result<()> {
        s3.put_object()
            .key(self.key())
            .body(body)
            .send()
            .await?;

        Ok(())
    }

    pub(crate) fn id(&self) -> Uuid {
        self.id
    }
}
impl From<FileQuery> for File {
    fn from(value: FileQuery) -> Self {
        Self {
            id: value.id,
            created: value.created.into(),
            name: value.name,
        }
    }
}

#[derive(Queryable)]
pub(crate) struct FileQuery {
    id: Uuid,
    created: Datetime,
    name: String,
}
