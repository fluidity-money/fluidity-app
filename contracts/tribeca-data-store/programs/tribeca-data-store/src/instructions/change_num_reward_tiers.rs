//! change payout reward tiers (m) in [CalculateNArgs].

use crate::*;

/// Accounts for [fluid_dao::change_num_reward_tiers].
#[derive(Accounts)]
pub struct ChangeNumRewardTiers<'info> {
    #[account(mut)]
    /// CalculateNArgs determines behaviour of worker
    pub calculaten_args: Account<'info, CalculateNArgs>,

    /// Authority account
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ChangeNumRewardTiers>, m: u8) -> Result<()> {
    let calculaten_args = &mut ctx.accounts.calculaten_args;

    calculaten_args.m = m;

    Ok(())
}

impl<'info> Validate<'info> for ChangeNumRewardTiers<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.calculaten_args.authority, self.authority);

        Ok(())
    }
}
