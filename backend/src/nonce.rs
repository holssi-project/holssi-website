use rand::{distributions::Alphanumeric, Rng};
use serde::Deserialize;

#[derive(Deserialize)]
pub(crate) struct Nonce {
    pub(crate) nonce: String,
}
impl Nonce {
    pub(crate) fn new() -> Nonce {
        let nonce: String = rand::thread_rng()
            .sample_iter(&Alphanumeric)
            .take(10)
            .map(char::from)
            .collect();
        Nonce { nonce }
    }

    pub(crate) fn get(&self) -> &str {
        self.nonce.as_ref()
    }
}
