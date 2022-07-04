//! Creates a [GaugeVote].

use vipers::assert_keys_eq;

use crate::*;

/// Accounts for [gauge::create_gauge_vote].
#[derive(Accounts)]
pub struct CreateGaugeVote<'info> {
    /// The [GaugeVote] to be created.
    #[account(
        init,
        seeds = [
            b"GaugeVote".as_ref(),
            gauge_voter.key().as_ref(),
            gauge.key().as_ref(),
        ],
        bump,
        space = 8 + GaugeVote::LEN,
        payer = payer
    )]
    pub gauge_vote: Account<'info, GaugeVote>,

    /// Gauge voter.
    pub gauge_voter: Account<'info, GaugeVoter>,

    /// Gauge.
    pub gauge: Account<'info, Gauge>,

    /// Payer.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program.
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateGaugeVote>) -> Result<()> {
    let gauge_vote = &mut ctx.accounts.gauge_vote;
    gauge_vote.gauge_voter = ctx.accounts.gauge_voter.key();
    gauge_vote.gauge = ctx.accounts.gauge.key();

    gauge_vote.weight = 0;

    emit!(GaugeVoteCreateEvent {
        gaugemeister: ctx.accounts.gauge.gaugemeister,
        gauge: gauge_vote.gauge,
        utility_mine: ctx.accounts.gauge.utility_mine,
        gauge_voter_owner: ctx.accounts.gauge_voter.owner,
    });

    Ok(())
}

impl<'info> Validate<'info> for CreateGaugeVote<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gauge_voter.gaugemeister, self.gauge.gaugemeister);
        Ok(())
    }
}

/// Event called in [gauge::create_gauge_vote].
#[event]
pub struct GaugeVoteCreateEvent {
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
}
