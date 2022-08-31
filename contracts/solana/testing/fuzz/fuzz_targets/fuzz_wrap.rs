#![no_main]
use borsh::ser::BorshSerialize;
use bumpalo::Bump;
use fluidity::instruction::FluidityInstruction;
use libfuzzer_sys::fuzz_target;
use solana_fluidity_fuzz::*;
use std::str;

fuzz_target!(|data: &[u8]| {
    if Ok(seed) = data.to_string() {
        let bump_lifetime = Bump::new();
        let amount = 100;
        let bump = data[0];
        let fun = FluidityInstruction::Wrap(amount, seed, bump);
        let program_id = random_pubkey(&bump_lifetime);
        process_instruction(program_id, &[], &fun.try_to_vec().unwrap());
    }
});
