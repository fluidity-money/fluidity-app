//! change payout_freq ratio in [TrfVars].

use crate::*;

/// Accounts for [fluid_dao::change_payout_freq].
#[derive(Accounts)]
pub struct ChangePayoutFreq<'info> {
    #[account(mut)]
    /// CalculateNArgs determines behaviour of worker
    pub trf_vars: Account<'info, TrfVars>,

    /// The authority calling transaction
    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<ChangePayoutFreq>,
    payout_freq_num: u32,
    payout_freq_denom: u32,
) -> Result<()> {
    if payout_freq_num == 0 {
        panic!("cannot have payout frequency of 0")
    }

    if payout_freq_denom == 0 {
        panic!("divide by zero error")
    }

    if payout_freq_num >= payout_freq_denom {
        panic!("Cannot have ratio >= 1")
    }

    let trf_vars = &mut ctx.accounts.trf_vars;

    trf_vars.payout_freq_num = payout_freq_num;
    trf_vars.payout_freq_denom = payout_freq_denom;

    Ok(())
}

impl<'info> Validate<'info> for ChangePayoutFreq<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.trf_vars.authority, self.authority);

        Ok(())
    }
}
