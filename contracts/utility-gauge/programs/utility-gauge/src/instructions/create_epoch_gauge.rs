//! Creates an [EpochGauge].

use crate::*;

/// Accounts for [gauge::create_epoch_gauge].
#[derive(Accounts)]
#[instruction(_bump: u8, voting_epoch: u32)]
pub struct CreateEpochGauge<'info> {
    /// The [Gauge] to create an [EpochGauge] of.
    pub gauge: Account<'info, Gauge>,

    /// The [EpochGauge] to be created.
    #[account(
        init,
        seeds = [
            b"EpochGauge".as_ref(),
            gauge.key().as_ref(),
            voting_epoch.to_le_bytes().as_ref()
        ],
        bump,
        space = 8 + EpochGauge::LEN,
        payer = payer
    )]
    pub epoch_gauge: Account<'info, EpochGauge>,

    /// Payer.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program.
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateEpochGauge>, voting_epoch: u32) -> Result<()> {
    let epoch_gauge = &mut ctx.accounts.epoch_gauge;
    epoch_gauge.gauge = ctx.accounts.gauge.key();
    epoch_gauge.voting_epoch = voting_epoch;
    epoch_gauge.total_power = 0;

    emit!(EpochGaugeCreateEvent {
        gaugemeister: ctx.accounts.gauge.gaugemeister,
        utility_mine: ctx.accounts.gauge.utility_mine,
        voting_epoch,
    });

    Ok(())
}

impl<'info> Validate<'info> for CreateEpochGauge<'info> {
    fn validate(&self) -> Result<()> {
        Ok(())
    }
}

#[event]
/// Event called in called in [gauge::create_gauge_vote].
pub struct EpochGaugeCreateEvent {
    #[index]
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    #[index]
    /// The [quarry_mine::Quarry] being voted on.
    pub utility_mine: Pubkey,
    /// The epoch associated with this [EpochGauge].
    pub voting_epoch: u32,
}
