//! change payout reward tiers (winning_classes/m) in [TrfVars].

use crate::*;

/// Accounts for [fluid_dao::change_num_reward_tiers].
#[derive(Accounts)]
pub struct ChangeNumRewardTiers<'info> {
    #[account(mut)]
    /// CalculateNArgs determines behaviour of worker
    pub trf_vars: Account<'info, TrfVars>,

    /// Authority account
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ChangeNumRewardTiers>, winning_classes: u8) -> Result<()> {
    if winning_classes <= 4 {
        panic!("number of reward tiers must be larger than 4")
    }

    if winning_classes > 8 {
        panic!("number of reward tiers must not exceed 8")
    }

    let trf_vars = &mut ctx.accounts.trf_vars;

    trf_vars.winning_classes = winning_classes;

    Ok(())
}

impl<'info> Validate<'info> for ChangeNumRewardTiers<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.trf_vars.authority, self.authority);

        Ok(())
    }
}
