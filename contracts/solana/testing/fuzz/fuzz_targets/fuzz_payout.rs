#![no_main]
use libfuzzer_sys::fuzz_target;
use solana_fluidity_fuzz::{
    process_instruction, setup_payout_keys
};
use bumpalo::Bump;
use fluidity::instruction::FluidityInstruction;
use std::str;
use borsh::ser::BorshSerialize;


fuzz_target!(|data: &[u8]| {
    if let Ok(blah) = str::from_utf8(data) {
        let bump = Bump::new();
        let accs = setup_payout_keys(&bump);
        let fun = FluidityInstruction::(blah.to_string());
        process_instruction(accs.token_program.owner, &[], &fun.try_to_vec().unwrap());
    }
    
    
});
