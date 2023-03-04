use std::{env, net::{SocketAddr, Ipv6Addr}, sync::Arc};

use axum::{
    extract::DefaultBodyLimit,
    http::{header, HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Router,
};
use common::AppRes;
use db::Database;
use tower_http::{cors::CorsLayer, limit::RequestBodyLimitLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::route::{build_failed, create, status, upload_ent, upload_exe};

mod common;
mod db;
mod file;
mod nonce;
mod project;
mod route;

#[tokio::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "holssi_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url = env::var("DATABASE_URL").expect("env DATABASE_URL missing");

    let db = Database::new(&database_url).await?;

    let s3 = {
        let endpoint = env::var("AWS_ENDPOINT").expect("env AWS_ENDPOINT not fount");
        let s3_config = aws_config::from_env().endpoint_url(endpoint).load().await;
        aws_sdk_s3::Client::new(&s3_config)
    };

    let shared_state = Arc::new(AppState { db, s3 });

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/project/create", post(create))
        .route("/project/:id/upload_ent", post(upload_ent))
        .route("/project/:id/status", get(status))
        .route("/project/:id/upload_exe", post(upload_exe))
        .route("/project/:id/failed", post(build_failed))
        .with_state(shared_state)
        .layer(TraceLayer::new_for_http())
        .layer(
            CorsLayer::new()
                .allow_origin(
                    env::var("FRONTEND_ORIGIN")
                        .expect("env FRONTEND_ORIGIN missing")
                        .parse::<HeaderValue>()
                        .unwrap(),
                )
                .allow_methods([Method::GET, Method::POST])
                .allow_headers([header::CONTENT_TYPE]),
        )
        .layer(DefaultBodyLimit::disable())
        .layer(RequestBodyLimitLayer::new(
            200 * 1024 * 1024, /* 200mb */
        ));

    let addr = SocketAddr::new(Ipv6Addr::UNSPECIFIED.into(), 9000);
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

struct AppState {
    db: Database,
    s3: aws_sdk_s3::Client,
}

#[derive(Debug)]
struct AppError(anyhow::Error);
type Result<T> = std::result::Result<T, AppError>;

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            AppRes::fail(format!("Something went wrong: {}", self.0)),
        )
            .into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}
