#![no_main]
use borsh::ser::BorshSerialize;
use bumpalo::Bump;
use fluidity::instruction::FluidityInstruction;
use libfuzzer_sys::fuzz_target;
use solana_fluidity_fuzz::*;

fuzz_target!(|data: &[u8]| {
    let bump = Bump::new();
    let fun = FluidityInstruction::LogTVL;
    let program_id = random_pubkey(&bump);
    process_instruction(program_id, &[], &fun.try_to_vec().unwrap());
});
