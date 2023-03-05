use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use uuid::Uuid;

use crate::{
    common::gen_random_str,
    file::{Entry, Executable},
    project::{ProjectBuild, ProjectSimple, ProjectStatus},
    Result,
};

#[derive(Clone)]
pub(crate) struct Database(Pool<Postgres>);

impl Database {
    pub(crate) async fn new(url: &str) -> Result<Database> {
        let pool = PgPoolOptions::new().max_connections(5).connect(url).await?;

        sqlx::migrate!().run(&pool).await?;

        Ok(Database(pool))
    }

    pub(crate) async fn insert_project(&self) -> Result<ProjectSimple> {
        let nonce = gen_random_str();
        let result = sqlx::query_as!(
            ProjectSimple,
            r#"INSERT INTO projects (build_nonce) VALUES ($1) RETURNING project_id, created, status AS "status: _";"#,
            nonce,
        )
        .fetch_one(&self.0)
        .await?;
        Ok(result)
    }
    pub(crate) async fn select_project_simple(&self, id: &Uuid) -> Result<ProjectSimple> {
        let result = sqlx::query_as!(
            ProjectSimple,
            r#"SELECT project_id, created, status AS "status: _" FROM projects WHERE project_id = $1;"#,
            id,
        ).fetch_one(&self.0).await?;
        Ok(result)
    }
    pub(crate) async fn select_project_build(&self, id: &Uuid) -> Result<ProjectBuild> {
        let result = sqlx::query_as!(
            ProjectBuild,
            r#"SELECT build_nonce, status AS "status: _" FROM projects WHERE project_id = $1;"#,
            id,
        )
        .fetch_one(&self.0)
        .await?;
        Ok(result)
    }
    pub(crate) async fn create_ent_file(&self, project_id: &Uuid, name: &str) -> Result<Entry> {
        let result = sqlx::query_as!(
            Entry,
            r#"INSERT INTO entrys (project_id, name) VALUES ($1, $2) RETURNING entry_id, name;"#,
            project_id,
            name
        )
        .fetch_one(&self.0)
        .await?;
        Ok(result)
    }
    pub(crate) async fn create_exe_file(
        &self,
        project_id: &Uuid,
        name: &str,
    ) -> Result<Executable> {
        let result = sqlx::query_as!(
            Executable,
            r#"INSERT INTO executables (project_id, name) VALUES ($1, $2) RETURNING executable_id, name;"#,
            project_id,
            name
        )
        .fetch_one(&self.0)
        .await?;
        Ok(result)
    }
    pub(crate) async fn update_project_status(
        &self,
        project_id: &Uuid,
        status: &ProjectStatus,
    ) -> Result<ProjectSimple> {
        let result = sqlx::query_as!(
            ProjectSimple,
            r#"
            UPDATE projects
            SET status = $1
            WHERE project_id = $2
            RETURNING project_id, status AS "status: _", created;
            "#,
            status as _,
            project_id,
        )
        .fetch_one(&self.0)
        .await?;
        Ok(result)
    }
    pub(crate) async fn select_entry_file(&self, project_id: &Uuid) -> Result<Entry> {
        let result = sqlx::query_as!(
            Entry,
            r#"SELECT entry_id, name FROM entrys WHERE project_id = $1;"#,
            project_id,
        )
        .fetch_one(&self.0)
        .await?;
        Ok(result)
    }
}
