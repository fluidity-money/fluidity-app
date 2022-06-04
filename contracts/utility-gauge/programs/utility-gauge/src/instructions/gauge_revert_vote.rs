//! Reverts a vote.

use crate::*;

/// Accounts for [gauge::gauge_revert_vote].
#[derive(Accounts)]
pub struct GaugeRevertVote<'info> {
    pub gaugemeister: Account<'info, Gaugemeister>,
    pub gauge: Account<'info, Gauge>,
    pub gauge_voter: Account<'info, GaugeVoter>,
    pub gauge_vote: Account<'info, GaugeVote>,

    #[account(mut)]
    pub epoch_gauge: Account<'info, EpochGauge>,
    #[account(mut)]
    pub epoch_gauge_voter: Account<'info, EpochGaugeVoter>,

    /// The escrow.
    #[account(has_one = vote_delegate @ crate::ErrorCode::UnauthorizedNotDelegate)]
    pub escrow: Account<'info, locked_voter::Escrow>,
    /// The vote delegate.
    pub vote_delegate: Signer<'info>,

    /// The [EpochGaugeVote] to revert.
    #[account(
        mut,
        close = payer,
    )]
    pub epoch_gauge_vote: Account<'info, EpochGaugeVote>,

    #[account(mut)]
    pub payer: Signer<'info>,
}

pub fn handler(ctx: Context<GaugeRevertVote>) -> Result<()> {
    let epoch_gauge = &mut ctx.accounts.epoch_gauge;
    let epoch_voter = &mut ctx.accounts.epoch_gauge_voter;
    let epoch_vote = &mut ctx.accounts.epoch_gauge_vote;

    let power_subtract = epoch_vote.allocated_power;
    epoch_voter.allocated_power =
        unwrap_int!(epoch_voter.allocated_power.checked_sub(power_subtract));
    epoch_gauge.total_power = unwrap_int!(epoch_gauge.total_power.checked_sub(power_subtract));

    emit!(RevertGaugeVoteEvent {
        gaugemeister: ctx.accounts.gaugemeister.key(),
        gauge: ctx.accounts.gauge.key(),
        utility_mine: ctx.accounts.gauge.utility_mine,
        gauge_voter_owner: ctx.accounts.gauge_voter.owner,
        subtracted_power: power_subtract,
        voting_epoch: epoch_voter.voting_epoch,
        updated_allocated_power: epoch_voter.allocated_power,
        updated_total_power: epoch_gauge.total_power,
    });

    Ok(())
}

impl<'info> Validate<'info> for GaugeRevertVote<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gaugemeister, self.gauge.gaugemeister);
        let voting_epoch = self.gaugemeister.voting_epoch()?;
        invariant!(
            self.epoch_gauge.voting_epoch == voting_epoch,
            EpochGaugeNotVoting
        );
        invariant!(
            self.epoch_gauge_voter.voting_epoch == voting_epoch,
            EpochGaugeNotVoting
        );

        assert_keys_eq!(self.epoch_gauge.gauge, self.gauge);
        assert_keys_eq!(self.epoch_gauge_voter.gauge_voter, self.gauge_voter);

        assert_keys_eq!(self.gauge_vote.gauge_voter, self.gauge_voter);
        assert_keys_eq!(self.gauge_vote.gauge, self.gauge);

        let (epoch_gauge_vote_key, _) =
            EpochGaugeVote::find_program_address(&self.gauge_vote.key(), voting_epoch);
        assert_keys_eq!(epoch_gauge_vote_key, self.epoch_gauge_vote);

        assert_keys_eq!(self.escrow, self.gauge_voter.escrow);
        assert_keys_eq!(self.vote_delegate, self.escrow.vote_delegate);

        Ok(())
    }
}

/// Event called in [gauge::gauge_revert_vote].
#[event]
pub struct RevertGaugeVoteEvent {
    #[index]
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    #[index]
    /// The [Gauge].
    pub gauge: Pubkey,
    #[index]
    /// The [quarry_mine::Quarry] being voted on.
    pub utility_mine: Pubkey,
    #[index]
    /// Owner of the Escrow of the [GaugeVoter].
    pub gauge_voter_owner: Pubkey,
    /// The epoch that the [GaugeVoter] is voting for.
    pub voting_epoch: u32,
    /// Allocated power subtracted
    pub subtracted_power: u64,
    /// The total amount of gauge voting power that has been allocated for the epoch voter.
    pub updated_allocated_power: u64,
    /// The total number of power to be applied to the latest voted epoch gauge.
    pub updated_total_power: u64,
}
