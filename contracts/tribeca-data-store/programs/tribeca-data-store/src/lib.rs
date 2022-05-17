use anchor_lang::prelude::*;
use vipers::prelude::*;

mod constants;
mod instructions;
mod state;

pub use constants::*;
pub use state::*;

use instructions::*;

declare_id!("HdSHLoG6gbQ7tkMvB87QraPpdxF9bnfNobbjnZxKviRS");

#[program]
pub mod tribeca_data_store {
    use super::*;

    #[access_control(ctx.accounts.validate())]
    pub fn initialize(ctx: Context<CreateCalculateNArgs>, bump: u8) -> Result<()> {
        initialize_payout::handler(ctx, bump)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn change_num_reward_tiers(
        ctx: Context<ChangeNumRewardTiers>,
        _bump: u8,
        winning_classes: u8,
    ) -> Result<()> {
        change_num_reward_tiers::handler(ctx, winning_classes)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn change_payout_frequency(
        ctx: Context<ChangePayoutFreq>,
        _bump: u8,
        payout_freq_num: u32,
        payout_freq_denom: u32,
    ) -> Result<()> {
        change_payout_freq::handler(ctx, payout_freq_num, payout_freq_denom)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn change_delta(
        ctx: Context<ChangeDelta>,
        _bump: u8,
        delta_weight_num: u32,
        delta_weight_denom: u32,
    ) -> Result<()> {
        change_delta::handler(ctx, delta_weight_num, delta_weight_denom)
    }
}
