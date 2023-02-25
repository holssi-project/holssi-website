use body::BuildInfo;
use project::{Project, ProjectStatus};
use rate_limit::RateLimit;
use worker::*;

mod body;
mod project;
mod rate_limit;
mod utils;

fn log_request(req: &Request) {
    console_log!(
        "{} - [{}], located at: {:?}, within: {}",
        Date::now().to_string(),
        req.path(),
        req.cf().coordinates().unwrap_or_default(),
        req.cf().region().unwrap_or_else(|| "unknown region".into())
    );
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: worker::Context) -> Result<Response> {
    log_request(&req);

    utils::set_panic_hook();

    let router = Router::new();

    router
        .get("/", |_, _| Response::ok("Hello from Holssi Workers!"))
        .post_async("/create", |mut req, ctx| async move {
            let kv = ctx.kv("holssi")?;

            // rate limit
            let ip = req
                .headers()
                .get("CF-Connecting-IP")?
                .unwrap_or_else(|| "0.0.0.0".to_string());
            let key = format!("ratelimit:{ip}");
            let mut rate_limit = match kv.get(&key).json::<RateLimit>().await? {
                Some(val) => val,
                None => RateLimit::new(),
            };
            if !rate_limit.is_ok() {
                return Response::error("Too Many Requests", 429);
            }
            rate_limit.update();
            kv.put(&key, &rate_limit)?
                .expiration(rate_limit.reset_date().timestamp().try_into().unwrap())
                .execute()
                .await?;

            let form = req.form_data().await?;
            match form.get("file") {
                Some(FormEntry::File(file)) => {
                    if !file.name().ends_with(".ent") || file.size() > 2 * 1024 * 1024 {
                        return Response::error("Bad Request", 400);
                    }

                    let project = Project::new(file.name());

                    let bucket = ctx.bucket("HOLSSI_BUCKET")?;
                    let key = project.entry_key();
                    bucket.put(&key, file.bytes().await?).execute().await?;

                    kv.put(&project.key(), &project)?.execute().await?;

                    Response::from_json(&project)
                }
                _ => Response::error("Bad Request", 400),
            }
        })
        .post_async("/build", |mut req, ctx| async move {
            let build_info = req.json::<BuildInfo>().await?;
            let kv = ctx.kv("holssi")?;
            match kv
                .get(&Project::get_key(build_info.uid()))
                .json::<Project>()
                .await?
            {
                Some(mut project) => {
                    // TODO: trigger actual build

                    project.set_status(ProjectStatus::Building);
                    kv.put(&project.key(), &project)?.execute().await?;

                    Response::from_json(&project)
                }
                None => Response::error("Bad Request", 400),
            }
        })
        .post_async("/finished", |mut req, ctx| async move {
            todo!()
        })
        .run(req, env)
        .await
}
