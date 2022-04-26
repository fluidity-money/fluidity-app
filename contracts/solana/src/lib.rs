// A program that implements transaction storing and payouts for Fluidity Money

#[cfg(all(target_arch = "bpf", not(feature = "exclude_entrypoint")))]
use solana_program::{entrypoint, declare_id};

use {
    solana_program::{
        account_info::AccountInfo,
        entrypoint::ProgramResult,
        pubkey::Pubkey,
    },
};

pub mod instruction;
pub mod processor;
mod state;
mod math;
mod error;

// declare the pubkey of the program
#[cfg(all(target_arch = "bpf", not(feature = "exclude_entrypoint")))]
declare_id!("GjRwsHMgCAX2QUrw64tyT9RQhqm28fmntNAjgxoaTztU");

// pass entrypoint through to processor
#[cfg(all(target_arch = "bpf", not(feature = "exclude_entrypoint")))]
entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    processor::process(program_id, accounts, instruction_data)?;
    Ok(())
}
