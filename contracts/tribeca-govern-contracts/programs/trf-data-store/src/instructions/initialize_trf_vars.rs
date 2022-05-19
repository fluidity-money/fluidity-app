//! create [TrfVars] account.

use std::str::FromStr;

use crate::*;

/// accounts for [fluidity_dao::create_trf_vars].
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateTrfVars<'info> {
    /// the [TrfVars] to be created.
    #[account(
        init,
        seeds = [
            b"trfDataStore".as_ref(),
        ],
        bump,
        payer = payer,
        // Add 10 bytes for pointer - Anchor doesn't like 4 bytes
        space = 10 + std::mem::size_of::<TrfVars>(),
    )]
    pub trf_vars: Account<'info, TrfVars>,

    #[account(mut)]
    /// Must be authority acc
    pub payer: Signer<'info>,

    /// system program
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateTrfVars>, bump: u8) -> Result<()> {
    let trf_vars = &mut ctx.accounts.trf_vars;

    trf_vars.bump = bump;
    trf_vars.authority = ctx.accounts.payer.key();

    // winning classes (reward tiers), must be > 4, <= 8, defaults to 5
    trf_vars.winning_classes = 5;

    // delta_weight is set to rate prize pool is drained, defaults to a year
    trf_vars.delta_weight_num = 31536000;
    trf_vars.delta_weight_denom = 1;

    // payout_freq is set to rate of jackpot payouts, defaults to once a quarter
    trf_vars.payout_freq_num = 1;
    trf_vars.payout_freq_denom = 4;

    Ok(())
}

impl<'info> Validate<'info> for CreateTrfVars<'info> {
    fn validate(&self) -> Result<()> {
        assert_eq!(self.payer.key, &Pubkey::from_str(AUTHORITY).unwrap());

        Ok(())
    }
}
