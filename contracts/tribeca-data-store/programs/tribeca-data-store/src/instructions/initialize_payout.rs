//! create [CalculateNArgs].

use std::str::FromStr;

use crate::*;

/// accounts for [fluidity_dao::create_calculaten_args].
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateCalculateNArgs<'info> {
    /// the [CalculateNArgs] to be created.
    #[account(
        init,
        seeds = [
            b"calculateNArgs".as_ref(),
        ],
        bump,
        payer = payer,
        // Add 10 bytes for pointer - Anchor doesn't like 4 bytes
        space = 10 + std::mem::size_of::<CalculateNArgs>(),
    )]
    pub calculaten_args: Account<'info, CalculateNArgs>,

    #[account(mut)]
    /// Must be authority acc
    pub payer: Signer<'info>,

    /// system program
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<CreateCalculateNArgs>, bump: u8) -> Result<()> {
    let calculaten_args = &mut ctx.accounts.calculaten_args;

    calculaten_args.bump = bump;
    calculaten_args.authority = ctx.accounts.payer.key();

    calculaten_args.winning_classes = 5;
    calculaten_args.delta_weight_num = 31536000;
    calculaten_args.delta_weight_denom = 1;

    calculaten_args.payout_freq_num = 1;
    calculaten_args.payout_freq_denom = 4;

    Ok(())
}

impl<'info> Validate<'info> for CreateCalculateNArgs<'info> {
    fn validate(&self) -> Result<()> {
        assert_eq!(self.payer.key, &Pubkey::from_str(AUTHORITY).unwrap());

        Ok(())
    }
}
