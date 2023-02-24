use worker::*;

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
        .post_async("/upload/:type", |mut req, ctx| async move {
            if let Some(upload_type) = ctx.param("type") {
                let form = req.form_data().await?;
                match form.get("file") {
                    Some(FormEntry::File(file)) => {
                        // TODO: verify uploaded file: file type, size, etc
                        let bucket = ctx.bucket("HOLSSI_BUCKET")?;
                        let key = format!("{upload_type}/{}", file.name());
                        bucket.put(&key, file.bytes().await?).execute().await?;
                        let res = UploadResponse { key };
                        return Response::from_json(&res);
                    }
                    _ => return Response::error("Bad Request", 400),
                }
            }

            Response::error("Bad Request", 400)
        })
        .run(req, env)
        .await
}

#[derive(serde::Serialize)]
struct UploadResponse {
    key: String,
}
