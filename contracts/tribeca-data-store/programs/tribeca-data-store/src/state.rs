//! Struct definitions for data accounts

use crate::*;

#[account]
#[derive(Copy, Debug, Default)]
pub struct CalculateNArgs {
    // authority is the original account initializing data
    pub authority: Pubkey,

    // Bump
    pub bump: u8,

    // payout_frequency is the ratio of payout frequency
    pub payout_freq_num: u32,
    pub payout_freq_denom: u32,

    // winning_classes is the number of reward tiers
    pub winning_classes: u8,

    // delta_weight is the ratio f
    pub delta_weight_num: u32,
    pub delta_weight_denom: u32,
}
