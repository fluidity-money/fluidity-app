//! Instructions for the Quarry Gauge system.

pub mod close_epoch_gauge_vote;
pub mod create_epoch_gauge;
pub mod create_gauge;
pub mod create_gauge_vote;
pub mod create_gauge_voter;
pub mod create_gaugemeister;
pub mod gauge_commit_vote;
pub mod gauge_disable;
pub mod gauge_enable;
pub mod gauge_revert_vote;
pub mod gauge_set_vote;
pub mod prepare_epoch_gauge_voter;
pub mod reset_epoch_gauge_voter;
pub mod set_gaugemeister_params;
pub mod sync_disabled_gauge;
pub mod sync_gauge;
pub mod trigger_next_epoch;

pub use close_epoch_gauge_vote::*;
pub use create_epoch_gauge::*;
pub use create_gauge::*;
pub use create_gauge_vote::*;
pub use create_gauge_voter::*;
pub use create_gaugemeister::*;
pub use gauge_commit_vote::*;
pub use gauge_disable::*;
pub use gauge_enable::*;
pub use gauge_revert_vote::*;
pub use gauge_set_vote::*;
pub use prepare_epoch_gauge_voter::*;
pub use reset_epoch_gauge_voter::*;
pub use set_gaugemeister_params::*;
pub use sync_disabled_gauge::*;
pub use sync_gauge::*;
pub use trigger_next_epoch::*;
