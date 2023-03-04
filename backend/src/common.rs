use axum::Json;
use rand::{distributions::Alphanumeric, Rng};
use serde::Serialize;

#[derive(Serialize)]
pub(crate) struct AppRes<T> {
    success: bool,
    data: T,
}
impl<T> AppRes<T> {
    pub(crate) fn success(data: T) -> Json<AppRes<T>> {
        Json(AppRes {
            success: true,
            data,
        })
    }
    pub(crate) fn fail(data: T) -> Json<AppRes<T>> {
        Json(AppRes {
            success: false,
            data,
        })
    }
}

pub(crate) fn gen_random_str() -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(10)
        .map(char::from)
        .collect()
}
