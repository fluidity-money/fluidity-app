//! Syncs a disabled [Gauge].

use quarry_operator::Operator;

use crate::*;

/// Accounts for [gauge::sync_disabled_gauge].
#[derive(Accounts)]
pub struct SyncDisabledGauge<'info> {
    /// The [Gaugemeister].
    #[account(has_one = rewarder)]
    pub gaugemeister: Account<'info, Gaugemeister>,

    /// The [Gauge].
    pub gauge: Account<'info, Gauge>,

    /// [Gauge::quarry].
    #[account(mut)]
    pub quarry: Account<'info, quarry_mine::Quarry>,

    /// [Gaugemeister::operator].
    #[account(mut)]
    pub operator: Account<'info, Operator>,

    /// [Gaugemeister::rewarder].
    /// CHECK: validated by key, not deserialized to save CU's.
    #[account(mut)]
    pub rewarder: UncheckedAccount<'info>,

    /// [quarry_mine] program.
    pub quarry_mine_program: Program<'info, quarry_mine::program::QuarryMine>,
    /// [quarry_operator] program.
    pub quarry_operator_program: Program<'info, quarry_operator::program::QuarryOperator>,
}

impl<'info> SyncDisabledGauge<'info> {
    fn disable_rewards(&self) -> Result<()> {
        // Only call CPI if the rewards share actually changed.
        if self.quarry.rewards_share != 0 {
            let gm_seeds: &[&[&[u8]]] = gaugemeister_seeds!(self.gaugemeister);
            quarry_operator::cpi::delegate_set_rewards_share(
                CpiContext::new(
                    self.quarry_operator_program.to_account_info(),
                    quarry_operator::cpi::accounts::DelegateSetRewardsShare {
                        with_delegate: quarry_operator::cpi::accounts::WithDelegate {
                            operator: self.operator.to_account_info(),
                            delegate: self.gaugemeister.to_account_info(),
                            rewarder: self.rewarder.to_account_info(),
                            quarry_mine_program: self.quarry_mine_program.to_account_info(),
                        },
                        quarry: self.quarry.to_account_info(),
                    },
                )
                .with_signer(gm_seeds),
                0,
            )?;
        }

        Ok(())
    }
}

pub fn handler(ctx: Context<SyncDisabledGauge>) -> Result<()> {
    ctx.accounts.disable_rewards()
}

impl<'info> Validate<'info> for SyncDisabledGauge<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gaugemeister, self.gauge.gaugemeister);
        assert_keys_eq!(self.gaugemeister.rewarder, self.rewarder);
        assert_keys_eq!(self.gaugemeister.operator, self.operator);
        invariant!(self.gauge.is_disabled);

        assert_keys_eq!(self.quarry, self.gauge.utility_mine);
        assert_keys_eq!(self.quarry.rewarder, self.rewarder);
        assert_keys_eq!(self.operator.rewarder, self.rewarder);

        invariant!(
            self.gaugemeister.current_rewards_epoch != 0,
            GaugeEpochCannotBeZero
        );

        Ok(())
    }
}
