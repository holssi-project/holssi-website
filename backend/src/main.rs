use std::{env, net::SocketAddr, sync::Arc};

use axum::{
    http::{header, HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{get, post},
    Router,
};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::route::{create, status};

mod project;
mod route;

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "holssi_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let db = edgedb_tokio::create_client()
        .await
        .expect("cannot connect to db");

    let shared_state = Arc::new(AppState { db });

    let app = Router::new()
        .route("/", get(|| async { "Hello, World!" }))
        .route("/create", post(create))
        .route("/status", get(status))
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
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 9000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

struct AppState {
    db: edgedb_tokio::Client,
}

struct AppError(anyhow::Error);
type Result<T> = std::result::Result<T, AppError>;

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Something went wrong: {}", self.0),
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
