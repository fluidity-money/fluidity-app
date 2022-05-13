//! change payout delta in [CalculateNArgs].

use crate::*;

/// Accounts for [fluid_dao::change_delta].
#[derive(Accounts)]
pub struct ChangeDelta<'info> {
    #[account(mut)]
    /// CalculateNArgs determines behaviour of worker
    pub calculaten_args: Account<'info, CalculateNArgs>,

    /// The authority
    pub authority: Signer<'info>,
}

pub fn handler(ctx: Context<ChangeDelta>, delta: u8) -> Result<()> {
    let calculaten_args = &mut ctx.accounts.calculaten_args;

    calculaten_args.delta = delta;

    Ok(())
}

impl<'info> Validate<'info> for ChangeDelta<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.calculaten_args.authority, self.authority);

        Ok(())
    }
}
