//! Enables a [Gauge].

use quarry_operator::Operator;

use crate::*;

/// Accounts for [gauge::sync_gauge].
#[derive(Accounts)]
pub struct SyncGauge<'info> {
    /// The [Gaugemeister].
    #[account(has_one = rewarder)]
    pub gaugemeister: Account<'info, Gaugemeister>,

    /// The [Gauge].
    pub gauge: Account<'info, Gauge>,

    /// The [EpochGauge].
    pub epoch_gauge: Account<'info, EpochGauge>,

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

/// Emitted on [gauge::sync_gauge].
#[event]
pub struct SyncGaugeEvent {
    /// The [Gauge].
    #[index]
    pub gauge: Pubkey,
    /// The [Gaugemeister].
    #[index]
    pub gaugemeister: Pubkey,
    /// The epoch synced.
    #[index]
    pub epoch: u32,
    /// The previous [quarry_mine::Quarry::rewards_share].
    pub previous_share: u64,
    /// The new [quarry_mine::Quarry::rewards_share].
    pub new_share: u64,
}

impl<'info> SyncGauge<'info> {
    fn set_rewards_share(&self) -> Result<()> {
        // Only call CPI if the rewards share actually changed.
        if self.quarry.rewards_share != self.epoch_gauge.total_power {
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
                self.epoch_gauge.total_power,
            )?;
        }

        // Emit event showing the share update.
        emit!(SyncGaugeEvent {
            gaugemeister: self.gaugemeister.key(),
            gauge: self.epoch_gauge.gauge,
            epoch: self.epoch_gauge.voting_epoch,
            previous_share: self.quarry.rewards_share,
            new_share: self.epoch_gauge.total_power
        });

        Ok(())
    }
}

pub fn handler(ctx: Context<SyncGauge>) -> Result<()> {
    ctx.accounts.set_rewards_share()
}

impl<'info> Validate<'info> for SyncGauge<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gaugemeister, self.gauge.gaugemeister);
        assert_keys_eq!(self.gaugemeister.rewarder, self.rewarder);
        assert_keys_eq!(self.gaugemeister.operator, self.operator);
        assert_keys_eq!(self.epoch_gauge.gauge, self.gauge);

        assert_keys_eq!(self.quarry, self.gauge.utility_mine);
        assert_keys_eq!(self.quarry.rewarder, self.rewarder);
        assert_keys_eq!(self.operator.rewarder, self.rewarder);

        invariant!(
            self.gaugemeister.current_rewards_epoch != 0,
            GaugeEpochCannotBeZero
        );
        invariant!(
            self.epoch_gauge.voting_epoch == self.gaugemeister.current_rewards_epoch,
            GaugeWrongEpoch
        );

        Ok(())
    }
}
