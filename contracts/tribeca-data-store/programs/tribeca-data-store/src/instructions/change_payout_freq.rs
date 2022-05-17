//! change payout freq_div in [CalculateNArgs].

use crate::*;

/// Accounts for [fluid_dao::change_payout_freq].
#[derive(Accounts)]
pub struct ChangePayoutFreq<'info> {
    #[account(mut)]
    /// CalculateNArgs determines behaviour of worker
    pub calculaten_args: Account<'info, CalculateNArgs>,

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

    let calculaten_args = &mut ctx.accounts.calculaten_args;

    calculaten_args.payout_freq_num = payout_freq_num;
    calculaten_args.payout_freq_denom = payout_freq_denom;

    Ok(())
}

impl<'info> Validate<'info> for ChangePayoutFreq<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.calculaten_args.authority, self.authority);

        Ok(())
    }
}
