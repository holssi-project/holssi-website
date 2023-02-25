use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};

const LIMIT: u64 = 3;

#[derive(Serialize, Deserialize)]
pub(crate) struct RateLimit {
    count: u64,
    reset_date: DateTime<Utc>,
}
impl RateLimit {
    pub(crate) fn new() -> RateLimit {
        RateLimit {
            count: 0,
            reset_date: Utc::now() + Duration::hours(1),
        }
    }
    pub(crate) fn is_ok(&self) -> bool {
        self.count < LIMIT || self.reset_date < Utc::now()
    }
    pub(crate) fn update(&mut self) {
        if self.reset_date < Utc::now() {
            self.count = 1;
            self.reset_date = Utc::now() + Duration::hours(1);
        } else {
            self.count += 1;
        }
    }

    pub(crate) fn reset_date(&self) -> DateTime<Utc> {
        self.reset_date
    }
}
