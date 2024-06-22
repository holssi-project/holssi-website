use std::{env, sync::Arc};

use reqwest::StatusCode;
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::{file::File, query::BuildBody, AppError, Result};

const MACHINE_CPU: u32 = 2;
const MACHINE_MEMORY: u32 = 1024;

#[derive(Clone)]
pub(crate) struct FlyIO {
    config: Arc<FlyIOConfig>,
    client: reqwest::Client,
}
impl FlyIO {
    pub(crate) fn new(client: reqwest::Client) -> FlyIO {
        let fly_io = FlyIOConfig::new();
        FlyIO {
            client,
            config: Arc::new(fly_io),
        }
    }

    fn get_url(&self, uri: &str) -> String {
        format!(
            "https://{}/v1/apps/{}{}",
            self.config.fly_hostname, self.config.app_name, uri
        )
    }

    fn get(&self, uri: &str) -> reqwest::RequestBuilder {
        let url = self.get_url(uri);
        self.client
            .get(url)
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", self.config.api_token))
    }
    fn post(&self, uri: &str) -> reqwest::RequestBuilder {
        let url = self.get_url(uri);
        self.client
            .post(url)
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", self.config.api_token))
    }

    pub(crate) async fn list_machines(&self) -> Result<Vec<Machine>> {
        let res = self.get("/machines").send().await?;
        if res.status() == StatusCode::OK {
            Ok(res.json::<Vec<Machine>>().await?)
        } else {
            Err(AppError(anyhow::anyhow!(
                "error from fly.io api: {}",
                res.text().await?
            )))
        }
    }

    pub(crate) async fn get_machine(&self, machine_id: &str) -> Result<Machine> {
        let res = self
            .get(&format!("/machines/{}", machine_id))
            .send()
            .await?;
        if res.status() == StatusCode::OK {
            Ok(res.json::<Machine>().await?)
        } else {
            Err(AppError(anyhow::anyhow!(
                "error from fly.io api: {}",
                res.text().await?
            )))
        }
    }

    pub(crate) async fn create_machine(&self) -> Result<Machine> {
        let machine = self
            .post("/machines")
            .json(&json!({
              "config": {
                  "image": "ghcr.io/jedeop/holssi:website-latest",
                  "guest": {
                    "cpu_kind": "shared",
                    "cpus": MACHINE_CPU,
                    "memory_mb": MACHINE_MEMORY
                  },
                  "restart": {
                    "policy": "no"
                  },
              },
              "skip_launch": true
            }))
            .send()
            .await?
            .json::<Machine>()
            .await?;
        Ok(machine)
    }

    pub(crate) async fn run_machine(
        &self,
        machine_id: &str,
        option: &RunMachineOption,
    ) -> Result<()> {
        let RunMachineOption {
            info,
            project_id,
            nonce,
            file,
        } = option;

        let file_url = format!("{}/{}", self.config.s3_base_url, file.key_url());

        let mut cmd = info.to_cmd();
        cmd.extend_from_slice(&[
            "--api-hostname",
            &self.config.self_base_url,
            "--project-id",
            project_id,
            "--nonce",
            nonce,
            &file_url,
        ]);

        let res = self
            .post(&format!("/machines/{}", machine_id))
            .json(&json!({
              "config": {
                "image": "ghcr.io/jedeop/holssi:website-latest",
                "guest": {
                  "cpu_kind": "shared",
                  "cpus": MACHINE_CPU,
                  "memory_mb": MACHINE_MEMORY
                },
                "restart": {
                  "policy": "no"
                },
                "processes": [
                  {
                    "cmd": cmd
                  }
                ],
              }
            }))
            .send()
            .await?;
        if res.status() == StatusCode::OK {
            Ok(())
        } else {
            Err(AppError(anyhow::anyhow!(
                "error from fly.io api: {}",
                res.text().await?
            )))
        }
    }
}

struct FlyIOConfig {
    fly_hostname: String,
    api_token: String,
    app_name: String,
    s3_base_url: String,
    self_base_url: String,
}

impl FlyIOConfig {
    fn new() -> Self {
        let fly_hostname = env::var("FLY_API_HOSTNAME").expect("env FLY_API_HOSTNAME missing");
        let api_token = env::var("FLY_API_TOKEN").expect("env FLY_API_TOKEN missing");
        let app_name = env::var("FLY_BUILD_APP_NAME").expect("env FLY_BUILD_API_NAME missing");
        let s3_base_url =
            env::var("AWS_S3_PUBLIC_BASE_URL").expect("env AWS_S3_PUBLIC_BASE_URL missing");
        let self_base_url = env::var("SELF_BASE_URL").expect("env SELF_BASE_URL missing");
        Self {
            fly_hostname,
            api_token,
            app_name,
            s3_base_url,
            self_base_url,
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "lowercase")]
pub(crate) enum MachineStatus {
    Created,
    Starting,
    Started,
    Stoping,
    Stopped,
    Destroyed,
}
#[derive(Deserialize)]
pub(crate) struct Machine {
    id: String,
    state: MachineStatus,
}

impl Machine {
    pub(crate) fn state(&self) -> &MachineStatus {
        &self.state
    }

    pub(crate) fn id(&self) -> &str {
        &self.id
    }
}

pub(crate) struct RunMachineOption {
    info: BuildBody,
    project_id: String,
    nonce: String,
    file: File,
}

impl RunMachineOption {
    pub(crate) fn new(info: BuildBody, project_id: Uuid, nonce: String, file: File) -> Self {
        Self {
            info,
            project_id: project_id.to_string(),
            nonce,
            file,
        }
    }
}
