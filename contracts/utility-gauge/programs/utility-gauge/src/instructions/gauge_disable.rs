//! Disables a [Gauge].

use vipers::assert_keys_eq;

use crate::*;

/// Accounts for [gauge::gauge_disable].
#[derive(Accounts)]
pub struct GaugeDisable<'info> {
    /// The [Gaugemeister].
    pub gaugemeister: Account<'info, Gaugemeister>,
    /// The [Gauge] to disable.
    #[account(mut)]
    pub gauge: Account<'info, Gauge>,
    /// The [Gaugemeister::foreman].
    pub foreman: Signer<'info>,
}

/// Emitted on [gauge::gauge_disable].
#[event]
pub struct GaugeDisableEvent {
    /// The [Gauge].
    #[index]
    pub gauge: Pubkey,
    /// The [Gaugemeister].
    #[index]
    pub gaugemeister: Pubkey,
    /// The [Gaugemeister::foreman] that disabled the gauge.
    pub foreman: Pubkey,
}

pub fn handler(ctx: Context<GaugeDisable>) -> Result<()> {
    let gauge = &mut ctx.accounts.gauge;
    gauge.is_disabled = true;
    emit!(GaugeDisableEvent {
        gaugemeister: ctx.accounts.gaugemeister.key(),
        gauge: gauge.key(),
        foreman: ctx.accounts.foreman.key(),
    });
    Ok(())
}

impl<'info> Validate<'info> for GaugeDisable<'info> {
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
