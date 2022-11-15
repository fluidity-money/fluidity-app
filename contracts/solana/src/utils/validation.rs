use {
    borsh::BorshDeserialize,
    solana_program::{account_info::AccountInfo, program_error::ProgramError, pubkey::Pubkey},
};

use crate::processor::*;

pub fn validate_authority<'a, 'b>(
    seed: &str,
    program_id: &Pubkey,
    fluidity_data_account: &'a AccountInfo<'b>,
    token_mint: &'a AccountInfo<'b>,
    fluidity_mint: &'a AccountInfo<'b>,
    pda_account: &'a AccountInfo<'b>,
    payer: &'a AccountInfo<'b>,
) -> Result<(&'a AccountInfo<'b>, FluidityData, &'a AccountInfo<'b>), ProgramError> {
    let data_seed = format!("FLU:{}_DATA_1", seed);

    if fluidity_data_account.key
        != &Pubkey::create_with_seed(pda_account.key, &data_seed, program_id).unwrap()
    {
        panic!("bad data account");
    }

    let fluidity_data = validate_fluidity_data_account(
        fluidity_data_account,
        *token_mint.key,
        *fluidity_mint.key,
        *pda_account.key,
    );

    if !payer.is_signer {
        panic!("bad payout authority");
    }

    return Ok((fluidity_data_account, fluidity_data, payer));
}

// check that base mint, fluid mint, and pda match those specified in the data account
// before doing this, check that the data account is valid!
pub fn validate_fluidity_data_account(
    data_account: &AccountInfo,
    token_mint: Pubkey,
    fluid_mint: Pubkey,
    pda: Pubkey,
) -> FluidityData {
    // get fluidity data
    let data = data_account.try_borrow_data().unwrap();
    let fluidity_data = FluidityData::deserialize(&mut &data[..]).unwrap();

    // check that mints and pda are consistent
    if (
        fluidity_data.token_mint,
        fluidity_data.fluid_mint,
        fluidity_data.pda,
    ) != (token_mint, fluid_mint, pda)
    {
        panic!("bad mint or pda");
    }

    fluidity_data
}
