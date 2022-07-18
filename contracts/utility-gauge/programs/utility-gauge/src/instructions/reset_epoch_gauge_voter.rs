//! Resets an [EpochGaugeVoter] to the latest power.

use crate::*;
use num_traits::ToPrimitive;
use vipers::{assert_keys_eq, invariant, unwrap_int};

/// Accounts for [gauge::reset_epoch_gauge_voter].
#[derive(Accounts)]
pub struct ResetEpochGaugeVoter<'info> {
    #[account(has_one = locker)]
    pub gaugemeister: Account<'info, Gaugemeister>,

    /// The [Gaugemeister::locker].
    pub locker: Account<'info, locked_voter::Locker>,

    /// The [GaugeVoter::escrow].
    #[account(has_one = locker)]
    pub escrow: Account<'info, locked_voter::Escrow>,

    /// The [EpochGaugeVoter::gauge_voter].
    #[account(has_one = gaugemeister, has_one = escrow)]
    pub gauge_voter: Account<'info, GaugeVoter>,

    /// The [EpochGaugeVoter] to reset.
    #[account(mut, has_one = gauge_voter)]
    pub epoch_gauge_voter: Account<'info, EpochGaugeVoter>,
}

impl<'info> ResetEpochGaugeVoter<'info> {
    /// Calculates the voting power.
    fn power(&self) -> Option<u64> {
        self.escrow.voting_power_at_time(
            &self.locker.params,
            self.gaugemeister.next_epoch_starts_at.to_i64()?,
        )
    }
}

pub fn handler(ctx: Context<ResetEpochGaugeVoter>) -> Result<()> {
    let voting_power = unwrap_int!(ctx.accounts.power());

    let epoch_gauge_voter = &mut ctx.accounts.epoch_gauge_voter;
    let prev_weight_change_seqno = epoch_gauge_voter.weight_change_seqno;
    let prev_voting_power = epoch_gauge_voter.voting_power;

    epoch_gauge_voter.voting_power = voting_power;
    epoch_gauge_voter.weight_change_seqno = ctx.accounts.gauge_voter.weight_change_seqno;

    emit!(ResetEpochGaugeVoterEvent {
        gaugemeister: ctx.accounts.gaugemeister.key(),
        gauge_voter_owner: ctx.accounts.gauge_voter.owner,
        prev_voting_power,
        voting_power: epoch_gauge_voter.voting_power,
        prev_weight_change_seqno,
        weight_change_seqno: epoch_gauge_voter.weight_change_seqno
    });

    Ok(())
}

impl<'info> Validate<'info> for ResetEpochGaugeVoter<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gaugemeister.locker, self.locker);
        assert_keys_eq!(self.escrow, self.gauge_voter.escrow);
        assert_keys_eq!(self.escrow.locker, self.locker);
        assert_keys_eq!(self.escrow.owner, self.gauge_voter.owner);

        let voting_epoch = self.gaugemeister.voting_epoch()?;
        invariant!(
            self.epoch_gauge_voter.voting_epoch == voting_epoch,
            EpochClosed
        );
        invariant!(
            self.epoch_gauge_voter.allocated_power == 0,
            AllocatedPowerMustBeZero
        );

        Ok(())
    }
}

/// Event called in [gauge::reset_epoch_gauge_voter].
#[event]
pub struct ResetEpochGaugeVoterEvent {
    #[index]
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    #[index]
    /// Owner of the Escrow of the [GaugeVoter].
    pub gauge_voter_owner: Pubkey,
    pub prev_voting_power: u64,
    pub voting_power: u64,
    pub prev_weight_change_seqno: u64,
    pub weight_change_seqno: u64,
}
