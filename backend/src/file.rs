use std::time::Duration;

use aws_sdk_s3::presigning::config::PresigningConfig;
use uuid::Uuid;

pub(crate) enum File {
    Entry(Entry),
    Executable(Executable),
}
impl File {
    pub(crate) fn key(&self) -> String {
        match self {
            File::Entry(file) => {
                format!("{}/{}", file.entry_id, file.name)
            }
            File::Executable(file) => {
                format!("{}/{}", file.executable_id, file.name)
            }
        }
    }

    // pub(crate) async fn upload(
    //     &self,
    //     s3: &aws_sdk_s3::Client,
    //     body: ByteStream,
    // ) -> crate::Result<()> {
    //     s3.put_object().key(self.key()).body(body).send().await?;

    //     Ok(())
    // }

    pub(crate) async fn get_presigned(&self, s3: &aws_sdk_s3::Client) -> crate::Result<String> {
        let presigned = s3
            .put_object()
            .key(self.key())
            .presigned(PresigningConfig::expires_in(Duration::from_secs(5 * 60))?)
            .await?;

        Ok(presigned.uri().to_string())
    }
}

pub(crate) struct Entry {
    pub(crate) entry_id: Uuid,
    // pub(crate) project_id: Uuid,
    pub(crate) name: String,
    // pub(crate) created: DateTime<Utc>,
}
pub(crate) struct Executable {
    pub(crate) executable_id: Uuid,
    // pub(crate) project_id: Uuid,
    pub(crate) name: String,
    // pub(crate) created: DateTime<Utc>,
}
