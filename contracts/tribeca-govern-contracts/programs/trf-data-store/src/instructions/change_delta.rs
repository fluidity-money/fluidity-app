//! change payout delta_weight in [TrfVars].

use crate::*;

/// Accounts for [fluid_dao::change_delta].
#[derive(Accounts)]
pub struct ChangeDelta<'info> {
    #[account(mut)]
    /// CalculateNArgs determines behaviour of worker
    pub trf_vars: Account<'info, TrfVars>,

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

    let trf_vars = &mut ctx.accounts.trf_vars;

    trf_vars.delta_weight_num = delta_weight_num;
    trf_vars.delta_weight_denom = delta_weight_denom;

    Ok(())
}

impl<'info> Validate<'info> for ChangeDelta<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.trf_vars.authority, self.authority);

        Ok(())
    }
}
