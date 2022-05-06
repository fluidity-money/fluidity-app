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

pub fn handler(ctx: Context<ChangePayoutFreq>, freq_div: u8) -> Result<()> {
    let calculaten_args = &mut ctx.accounts.calculaten_args;

    calculaten_args.freq_div = freq_div;

    Ok(())
}

impl<'info> Validate<'info> for ChangePayoutFreq<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.calculaten_args.authority, self.authority);

        Ok(())
    }
}
