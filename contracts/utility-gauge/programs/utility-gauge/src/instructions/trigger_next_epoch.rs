//! Triggers the next epoch.

use num_traits::ToPrimitive;
use vipers::{invariant, unwrap_int};

use crate::*;

/// Accounts for [gauge::trigger_next_epoch].
#[derive(Accounts)]
pub struct TriggerNextEpoch<'info> {
    /// The [Gaugemeister].
    #[account(mut)]
    pub gaugemeister: Account<'info, Gaugemeister>,
}

pub fn handler(ctx: Context<TriggerNextEpoch>) -> Result<()> {
    let now = unwrap_int!(Clock::get()?.unix_timestamp.to_u64());
    msg!(
        "now: {}; next: {}",
        now,
        ctx.accounts.gaugemeister.next_epoch_starts_at
    );
    invariant!(
        now >= ctx.accounts.gaugemeister.next_epoch_starts_at,
        NextEpochNotReached
    );

    let gaugemeister = &mut ctx.accounts.gaugemeister;
    gaugemeister.current_rewards_epoch = gaugemeister.voting_epoch()?;
    gaugemeister.next_epoch_starts_at =
        unwrap_int!(now.checked_add(unwrap_int!(gaugemeister.epoch_duration_seconds.to_u64())));
    Ok(())
}

impl<'info> Validate<'info> for TriggerNextEpoch<'info> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }
}
