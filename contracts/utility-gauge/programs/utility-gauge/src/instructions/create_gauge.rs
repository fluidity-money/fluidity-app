//! Creates a [Gauge].

use vipers::assert_keys_eq;

use crate::*;

/// Accounts for [gauge::create_gauge].
#[derive(Accounts)]
pub struct CreateGauge<'info> {
    /// The [Gauge] to be created.
    #[account(
        init,
        seeds = [
            b"Gauge".as_ref(),
            gaugemeister.key().as_ref(),
            utility_mine.key().as_ref(),
        ],
        bump,
        space = 8 + Gauge::LEN,
        payer = payer
    )]
    pub gauge: Account<'info, Gauge>,

    /// [Gaugemeister].
    pub gaugemeister: Account<'info, Gaugemeister>,

    /// Protocol Identifier
    pub utility_mine: UncheckedAccount<'info>,

    /// Payer.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program.
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateGauge>) -> Result<()> {
    let gauge = &mut ctx.accounts.gauge;
    gauge.gaugemeister = ctx.accounts.gaugemeister.key();
    gauge.utility_mine = ctx.accounts.utility_mine.key();
    // Since this is permissionless, gauges are disabled when they are created.
    gauge.is_disabled = true;

    Ok(())
}

impl<'info> Validate<'info> for CreateGauge<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gaugemeister.rewarder, self.utility_mine.rewarder);
        Ok(())
    }
}

/// Event called in [gauge::create_gauge].
#[event]
pub struct GaugeCreateEvent {
    #[index]
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    #[index]
    /// The Rewarder.
    pub rewarder: Pubkey,
    #[index]
    /// The [quarry_mine::Quarry] being voted on.
    pub utility_mine: Pubkey,
    #[index]
    /// Owner of the Escrow of the [GaugeVoter].
    pub gauge_voter_owner: Pubkey,
}
