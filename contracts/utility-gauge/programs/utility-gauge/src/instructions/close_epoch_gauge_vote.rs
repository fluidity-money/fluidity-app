//! Closes an [EpochGaugeVote], freeing lamports.

use crate::*;
use locked_voter::Escrow;

/// Accounts for [gauge::create_epoch_gauge].
#[derive(Accounts)]
#[instruction(voting_epoch: u32)]
pub struct CloseEpochGaugeVote<'info> {
    /// The [EpochGaugeVote] to close.
    /// Lamports go to the recipient.
    #[account(
        mut,
        seeds = [
            b"EpochGaugeVote".as_ref(),
            gauge_vote.key().as_ref(),
            voting_epoch.to_le_bytes().as_ref(),
        ],
        bump,
        close = recipient
    )]
    pub epoch_gauge_vote: Account<'info, EpochGaugeVote>,

    /// The [Gaugemeister].
    pub gaugemeister: Account<'info, Gaugemeister>,

    /// The [Gauge].
    #[account(has_one = gaugemeister)]
    pub gauge: Account<'info, Gauge>,

    /// The [GaugeVoter].
    #[account(has_one = gaugemeister, has_one = escrow)]
    pub gauge_voter: Account<'info, GaugeVoter>,

    /// The [GaugeVote].
    #[account(has_one = gauge_voter, has_one = gauge)]
    pub gauge_vote: Account<'info, GaugeVote>,

    /// The [Escrow] which owns this [EpochGaugeVote].
    #[account(has_one = vote_delegate @ crate::ErrorCode::UnauthorizedNotDelegate)]
    pub escrow: Account<'info, Escrow>,

    /// The [Escrow::vote_delegate].
    pub vote_delegate: Signer<'info>,

    /// Recipient of the freed lamports.
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
}

pub fn handler(ctx: Context<CloseEpochGaugeVote>, voting_epoch: u32) -> Result<()> {
    let current_voting_epoch = ctx.accounts.gaugemeister.voting_epoch()?;
    invariant!(voting_epoch < current_voting_epoch, CloseEpochNotElapsed);

    let (epoch_gauge_vote_key, _) =
        EpochGaugeVote::find_program_address(ctx.accounts.gauge_vote.as_key_ref(), voting_epoch);
    assert_keys_eq!(epoch_gauge_vote_key, ctx.accounts.epoch_gauge_vote);
    Ok(())
}

impl<'info> Validate<'info> for CloseEpochGaugeVote<'info> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }
}
