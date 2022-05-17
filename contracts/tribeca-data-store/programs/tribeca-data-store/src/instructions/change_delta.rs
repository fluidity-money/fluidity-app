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

pub fn handler(
    ctx: Context<ChangeDelta>,
    delta_weight_num: u32,
    delta_weight_denom: u32,
) -> Result<()> {
    if delta_weight_num == 0 {
        panic!("cannot have delta weight of 0")
    }

    if delta_weight_denom == 0 {
        panic!("divide by zero error")
    }

    let calculaten_args = &mut ctx.accounts.calculaten_args;

    calculaten_args.delta_weight_num = delta_weight_num;
    calculaten_args.delta_weight_denom = delta_weight_denom;

    Ok(())
}

impl<'info> Validate<'info> for ChangeDelta<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.calculaten_args.authority, self.authority);

        Ok(())
    }
}
