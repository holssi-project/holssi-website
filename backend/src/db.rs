use anyhow::Context;
use uuid::Uuid;

use crate::{
    common::ObjectId,
    file::FileQuery,
    project::{ProjectQuery, ProjectSimple, ProjectStatus},
    Result,
};

pub(crate) struct DB(edgedb_tokio::Client);

impl DB {
    pub(crate) async fn new() -> Result<DB> {
        let db = edgedb_tokio::create_client()
            .await
            .context("cannot connect to db")?;
        Ok(DB(db))
    }

    pub(crate) async fn insert_project(&self) -> Result<ObjectId> {
        let result = self
            .0
            .query_required_single::<ObjectId, _>("insert Project;", &())
            .await?;
        Ok(result)
    }
    pub(crate) async fn select_project_simple(&self, id: &Uuid) -> Result<ProjectSimple> {
        let result = self
            .0
            .query_required_single::<ProjectQuery, _>(
                r#"
                select Project {
                  id, created, status,
                  entry_file: { id, created, name },
                  executable: { id, created, name },
                  exe_nonce
                } filter .id = <uuid>$0;
                "#,
                &(id,),
            )
            .await?
            .into();
        Ok(result)
    }
    pub(crate) async fn select_project(&self, id: &Uuid) -> Result<ProjectQuery> {
        let result = self
            .0
            .query_required_single::<ProjectQuery, _>(
                r#"
                select Project {
                  id, created, status,
                  entry_file: { id, created, name },
                  executable: { id, created, name },
                  exe_nonce
                } filter .id = <uuid>$0;
                "#,
                &(id,),
            )
            .await?;
        Ok(result)
    }
    pub(crate) async fn add_ent_file_to_project(
        &self,
        project_id: &Uuid,
        file_id: &Uuid,
    ) -> Result<ObjectId> {
        let result = self
            .0
            .query_required_single::<ObjectId, _>(
                r#"
                update Project
                filter .id = <uuid>$0
                set {
                entry_file := (select File filter .id = <uuid>$1),
                status := ProjectStatus.Uploaded,
                };
                "#,
                &(project_id, file_id),
            )
            .await?;
        Ok(result)
    }
    pub(crate) async fn add_exe_file_to_project(
        &self,
        project_id: &Uuid,
        file_id: &Uuid,
    ) -> Result<ObjectId> {
        let result = self
            .0
            .query_required_single::<ObjectId, _>(
                r#"
                update Project
                filter .id = <uuid>$0
                set {
                executable := (select File filter .id = <uuid>$1),
                status := ProjectStatus.Success,
                };
                "#,
                &(project_id, file_id),
            )
            .await?;
        Ok(result)
    }
    pub(crate) async fn update_project_status(
        &self,
        project_id: &Uuid,
        status: &ProjectStatus,
    ) -> Result<ObjectId> {
        let result = self
            .0
            .query_required_single::<ObjectId, _>(
                r#"
                update Project
                filter .id = <uuid>$0
                set {
                status := <ProjectStatus>$1,
                };
                "#,
                &(project_id, status.to_string()),
            )
            .await?;
        Ok(result)
    }

    pub(crate) async fn insert_file(&self, name: &str) -> Result<FileQuery> {
        let file = self
            .0
            .query_required_single::<FileQuery, _>(
                r#"
                select (insert File {
                    name := <str>$0
                }) { id, created, name };
                "#,
                &(name,),
            )
            .await?;
        Ok(file)
    }
}
