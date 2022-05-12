use crate::{
    state::{Obligation, Reserve}
};

use {
    solana_program::{
        account_info::AccountInfo,
        program_pack::Pack,
    },
    spl_token::state::Mint,
};

// get_available_prize_pool gives total lamports from obligation, minus initial supply
pub fn get_available_prize_pool(
    obligation_info: &AccountInfo,
    reserve_info: &AccountInfo,
    fluidity_mint: &AccountInfo,
) -> u64 {
    // get obligation and reserve structs
    let obligation = Obligation::unpack(&obligation_info.data.borrow()).unwrap();
    let reserve = Reserve::unpack(&reserve_info.data.borrow()).unwrap();

    // get value of obligations
    let deposited_amount = obligation.deposits[0].deposited_amount;
    let deposited_value = reserve
        .collateral_exchange_rate()
        .unwrap()
        .collateral_to_liquidity(deposited_amount)
        .unwrap();

    // get fluidity mint object
    let fluid_mint = Mint::unpack(&fluidity_mint.data.borrow()).unwrap();

    // get amount of usdc deposited (has 6 decimals)
    let deposited_tokens = fluid_mint.supply;

    // get available prize pool
    let available_prize_pool = deposited_value - deposited_tokens;

    available_prize_pool
}
