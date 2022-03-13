#![deny(unaligned_references)]
use std::mem::size_of;
use std::str::FromStr;

use bumpalo::Bump;
use safe_transmute::to_bytes::{transmute_to_bytes, transmute_to_bytes_mut};
use solana_program::account_info::AccountInfo;
use solana_program::bpf_loader;
use solana_program::clock::Epoch;
use solana_program::entrypoint::ProgramResult;
use solana_program::program_pack::Pack;
use solana_program::pubkey::Pubkey;
use solana_program::rent::Rent;
use solana_program::system_program; // Core account library
use solana_program::sysvar;
use solana_program::sysvar::Sysvar;
use spl_token::state::Account as SplAccount;
use spl_token::state::Mint;

use fluidity::processor::process;

pub struct FluidityAccounts<'bump> {
    pub base: AccountInfo<'bump>,
    pub clock_info: AccountInfo<'bump>,
    pub collateral_info: AccountInfo<'bump>,
    pub data_account: AccountInfo<'bump>,
    pub deposited_collateral_info: AccountInfo<'bump>,
    pub destination_collateral_info: AccountInfo<'bump>,
    pub fluid_mint: AccountInfo<'bump>,
    pub fluidity_account: AccountInfo<'bump>,
    pub fluidity_data_account: AccountInfo<'bump>,
    pub fluidity_mint: AccountInfo<'bump>,
    pub lending_market_authority_info: AccountInfo<'bump>,
    pub lending_market_info: AccountInfo<'bump>,
    pub obligation_info: AccountInfo<'bump>,
    pub obligation_owner_info: AccountInfo<'bump>,
    pub payer: AccountInfo<'bump>,
    pub payout_account_a: AccountInfo<'bump>,
    pub payout_account_b: AccountInfo<'bump>,
    pub pda: AccountInfo<'bump>,
    pub pda_account: AccountInfo<'bump>,
    pub pyth_price_info: AccountInfo<'bump>,
    pub rent_info: AccountInfo<'bump>,
    pub reserve_collateral_mint_info: AccountInfo<'bump>,
    pub reserve_info: AccountInfo<'bump>,
    pub reserve_liquidity_supply_info: AccountInfo<'bump>,
    pub sender: AccountInfo<'bump>,
    pub solend_program: AccountInfo<'bump>,
    pub switchboard_feed_info: AccountInfo<'bump>,
    pub system_program: AccountInfo<'bump>,
    pub token_account: AccountInfo<'bump>,
    pub token_mint: AccountInfo<'bump>,
    pub token_program: AccountInfo<'bump>,
}

pub struct PayoutAccounts<'bump> {
    pub token_program: AccountInfo<'bump>,
    pub fluidity_mint: AccountInfo<'bump>,
    pub pda_account: AccountInfo<'bump>,
    pub obligation_info: AccountInfo<'bump>,
    pub payout_account_a: AccountInfo<'bump>,
    pub payout_account_b: AccountInfo<'bump>,
    pub payer: AccountInfo<'bump>,
}

pub fn random_pubkey(bump: &Bump) -> &Pubkey {
    bump.alloc(Pubkey::new(transmute_to_bytes(&rand::random::<[u64; 4]>())))
}

pub fn pad_bpf_data_size(unpadded_size: usize) -> usize {
    unpadded_size + 12
}

pub fn allocate_contract_data(data_size: usize, bump: &Bump) -> &mut [u8] {
    assert_eq!(data_size % 8, 0);
    let padded_data_size = pad_bpf_data_size(data_size);
    let u64_data = bump.alloc_slice_fill_copy(padded_data_size / 8 + 1, 0u64);
    &mut transmute_to_bytes_mut(u64_data)[3..padded_data_size + 3]
}

pub fn create_contract_acc<'bump>(
    data_size: usize,
    contract_addr: &'bump Pubkey,
    bump: &'bump Bump,
    rent: Rent,
) -> AccountInfo<'bump> {
    let padded_data_size = pad_bpf_data_size(data_size);
    let lamports = rent.minimum_balance(padded_data_size);
    AccountInfo::new(
        random_pubkey(bump),                     // Pubkey
        false,                                   // Is signer
        true,                                    // Is writable
        bump.alloc(lamports),                    // Lamports
        allocate_contract_data(data_size, bump), // Data
        contract_addr,                           // Owner
        false,                                   // Executable
        Epoch::default(),                        // Recent epoch
    )
}

pub fn create_token_acc<'bump, 'a, 'b>(
    mint_pubkey: &'a Pubkey,
    owner_pubkey: &'b Pubkey,
    balance: u64,
    bump: &'bump Bump,
    rent: Rent,
) -> AccountInfo<'bump> {
    let data = bump.alloc_slice_fill_copy(SplAccount::LEN, 0u8);
    let mut account = SplAccount::default();
    account.state = spl_token::state::AccountState::Initialized;
    account.mint = *mint_pubkey;
    account.owner = *owner_pubkey;
    account.amount = balance;
    SplAccount::pack(account, data).unwrap();

    let initialLamports = rent.minimum_balance(data.len());

    AccountInfo::new(
        random_pubkey(bump),         // Pubkey
        false,                       // Is signer
        true,                        // Is writable
        bump.alloc(initialLamports), // Lamports
        data,                        // Data
        &spl_token::ID,              // Owner
        false,                       // Executable
        Epoch::default(),            // Recent epoch
    )
}

pub fn create_token_mint(bump: &Bump, rent: Rent) -> AccountInfo {
    let data = bump.alloc_slice_fill_copy(Mint::LEN, 0u8);
    let mut mint = Mint::default();
    mint.is_initialized = true;
    Mint::pack(mint, data).unwrap();

    let initialLamports = rent.minimum_balance(data.len());

    AccountInfo::new(
        random_pubkey(bump),         // Pubkey
        false,                       // Is signer
        true,                        // Is writable
        bump.alloc(initialLamports), // Lamports
        data,                        // Data
        &spl_token::ID,              // Owner
        false,                       // Executable
        Epoch::default(),            // Recent epoch
    )
}

pub fn create_sol_acc(lamports: u64, bump: &Bump) -> AccountInfo {
    create_sol_acc_with_pubkey(random_pubkey(bump), lamports, bump)
}

pub fn create_sol_acc_with_pubkey<'bump>(
    pubkey: &'bump Pubkey,
    lamports: u64,
    bump: &'bump Bump,
) -> AccountInfo<'bump> {
    AccountInfo::new(
        pubkey,               // Pubkey
        true,                 // Is signer
        false,                // Is writable
        bump.alloc(lamports), // Lamports
        &mut [],              // Data
        &system_program::ID,  // Owner
        false,                // Executable
        Epoch::default(),     // Recent epoch
    )
}

pub fn create_spl_token_program(bump: &Bump) -> AccountInfo {
    AccountInfo::new(
        &spl_token::ID,   // Pubkey
        false,            // Is signer
        false,            // Is writable
        bump.alloc(0),    // Lamports
        &mut [],          // Data
        &bpf_loader::ID,  // Owner
        false,            // Executable
        Epoch::default(), // Recent epoch
    )
}

pub fn create_rent_sysvar_acc(lamports: u64, rent: Rent, bump: &Bump) -> AccountInfo {
    let data = bump.alloc_slice_fill_copy(size_of::<Rent>(), 0u8);
    let mut account_info = AccountInfo::new(
        &sysvar::rent::ID,    // Pubkey
        false,                // Is signer
        false,                // Is writable
        bump.alloc(lamports), // Lamports
        data,                 // Data
        &sysvar::ID,          // Owner
        false,                // Executable
        Epoch::default(),     // Recent epoch
    );
    rent.to_account_info(&mut account_info).unwrap();
    account_info
}

pub fn create_signer_acc<'bump>(pubkey: &'bump Pubkey, bump: &'bump Bump) -> AccountInfo<'bump> {
    AccountInfo::new(
        pubkey,              // Pubkey
        true,                // Is signer
        false,               // Is writable
        bump.alloc(0),       // Lamports
        &mut [],             // Data
        &system_program::ID, // Owner
        false,               // Executable
        Epoch::default(),    // Recent epoch
    )
}

/// Create all required accounts
pub fn setup_payout_keys(bump: &Bump) -> PayoutAccounts {
    let rent = Rent::default();
    let rent_sysvar = create_rent_sysvar_acc(100_000, rent, bump);
    let contract_key = random_pubkey(bump);

    let token_program = create_spl_token_program(bump);
    let fluidity_mint = create_token_mint(bump, rent);
    let pda_account_seed = format!("FLU:{}_OBLIGATION", "USDC"); // TODO: Change this when we support more toks
    let (pda_pubkey, _) =
        Pubkey::find_program_address(&[pda_account_seed.as_bytes()], &contract_key);

    // let pda_account = Pubkey::create_with_seed(&pda_pubkey, &data_account_seed, &program_id).unwrap();
    // Derived acc -> Pubkey::create_with_seed CLI/src/utils
    // let pda_account = derived_acc (seed, bump seed)
    
    let pda_account = create_sol_acc(0, bump);
    let obligation_info = create_sol_acc(0, bump); // derived acc, Owned by solend program, auth pda

    let payer = create_signer_acc(random_pubkey(bump), bump);

    let payout_account_a = create_token_acc(fluidity_mint.key, payer.key, 0, bump, rent);

    let payout_account_b = create_token_acc(fluidity_mint.key, payer.key, 0, bump, rent);

    PayoutAccounts {
        token_program,
        fluidity_mint,
        pda_account,
        obligation_info,
        payer,
        payout_account_a,
        payout_account_b,
    }
}

/// Runs contract entry point
pub fn process_instruction<'a>(
    program_id: &Pubkey,
    accounts: &[AccountInfo<'a>],
    instruction_data: &[u8],
) -> ProgramResult {
    let original_data: Vec<Vec<u8>> = accounts
        .iter()
        .map(|account| account.try_borrow_data().unwrap().to_vec())
        .collect();
    let result = fluidity::process_instruction(program_id, accounts, &instruction_data);
    if result.is_err() {
        for (account, original) in accounts.iter().zip(original_data) {
            let mut data = account.try_borrow_mut_data().unwrap();
            data.copy_from_slice(&original);
        }
    }
    result
}
