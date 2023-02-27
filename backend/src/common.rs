use edgedb_derive::Queryable;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Queryable)]
pub(crate) struct ObjectId {
    pub(crate) id: Uuid,
}

#[derive(Serialize)]
pub(crate) struct AppRes<T> {
    success: bool,
    data: T,
}
impl<T> AppRes<T> {
    pub(crate) fn success(data: T) -> AppRes<T> {
        AppRes {
            success: true,
            data,
        }
    }
    pub(crate) fn fail(data: T) -> AppRes<T> {
        AppRes {
            success: false,
            data,
        }
    }
}
