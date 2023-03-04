use serde::Deserialize;

#[derive(Deserialize)]
pub(crate) struct ExePresignedQuery {
    pub(crate) nonce: String,
    pub(crate) file_name: String,
}

#[derive(Deserialize)]
pub(crate) struct NonceQuery {
    pub(crate) nonce: String,
}
