//! Enables a [Gauge].

use vipers::assert_keys_eq;

use crate::*;

/// Accounts for [gauge::gauge_enable].
#[derive(Accounts)]
pub struct GaugeEnable<'info> {
    /// The [Gaugemeister].
    pub gaugemeister: Account<'info, Gaugemeister>,
    /// The [Gauge] to enable.
    #[account(mut)]
    pub gauge: Account<'info, Gauge>,
    /// The [Gaugemeister::foreman].
    pub foreman: Signer<'info>,
}

/// Emitted on [gauge::gauge_enable].
#[event]
pub struct GaugeEnableEvent {
    /// The [Gauge].
    #[index]
    pub gauge: Pubkey,
    /// The [Gaugemeister].
    #[index]
    pub gaugemeister: Pubkey,
    /// The [Gaugemeister::foreman] that enabled the gauge.
    pub foreman: Pubkey,
}

pub fn handler(ctx: Context<GaugeEnable>) -> Result<()> {
    let gauge = &mut ctx.accounts.gauge;
    gauge.is_disabled = false;
    emit!(GaugeEnableEvent {
        gaugemeister: ctx.accounts.gaugemeister.key(),
        gauge: gauge.key(),
        foreman: ctx.accounts.foreman.key(),
    });
    Ok(())
}

impl<'info> Validate<'info> for GaugeEnable<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(
            self.foreman,
            self.gaugemeister.foreman,
            UnauthorizedNotForeman
        );
        assert_keys_eq!(self.gauge.gaugemeister, self.gaugemeister);
        Ok(())
    }
}
