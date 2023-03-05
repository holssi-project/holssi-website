use std::{env, sync::Arc};

use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use reqwest::StatusCode;
use serde_json::json;

use crate::{file::File, query::BuildBody, AppError, Result};

#[derive(Clone)]
pub(crate) struct FlyIO(Arc<FlyIOConfig>);
impl FlyIO {
    pub(crate) fn new() -> FlyIO {
        let fly_io = FlyIOConfig::new();
        FlyIO(Arc::new(fly_io))
    }

    pub(crate) async fn create_machine(
        &self,
        client: &reqwest::Client,
        info: BuildBody,
        project_id: &str,
        nonce: &str,
        file: File,
    ) -> Result<()> {
        let url = format!(
            "http://{}/v1/apps/{}/machines",
            self.0.fly_hostname, self.0.app_name
        );

        let mut cmd = info.to_cmd();

        let file_url = format!("{}/{}", self.0.s3_base_url, file.key());
        let file_url_enc = utf8_percent_encode(&file_url, NON_ALPHANUMERIC).to_string();

        cmd.extend_from_slice(&[
            "--api-hostname",
            &self.0.self_base_url,
            "--project-id",
            project_id,
            "--nonce",
            nonce,
            &file_url_enc,
        ]);

        let res = client
            .post(&url)
            .header("Content-Type", "application/json")
            .header("Authorization", format!("Bearer {}", self.0.api_token))
            .json(&json!({
              "config": {
                "image": "ghcr.io/jedeop/holssi:website-latest",
                "guest": {
                  "cpu_kind": "shared",
                  "cpus": 1,
                  "memory_mb": 1024
                },
                "processes": [
                  {
                    "cmd": cmd
                  }
                ],
                "restart": {
                  "policy": "no"
                },
                "auto_destroy": true
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
