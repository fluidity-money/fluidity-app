//! Struct definitions for data accounts

use crate::*;

#[account]
#[derive(Copy, Debug, Default)]
pub struct CalculateNArgs {
    // authority is the original account initializing data
    pub authority: Pubkey,
    // freq_div is the divisor of payout frequency
    pub freq_div: u8,
    // m is the number of reward tiers
    pub m: u8,
    // Delta
    pub delta: u8,
    // Bump
    pub bump: u8,
}
