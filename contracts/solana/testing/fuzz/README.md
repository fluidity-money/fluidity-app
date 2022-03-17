
# Fuzzing code for Solana smart contracts

## Fuzzing code referenced here: [serum_dex](https://crates.io/crates/serum_dex)

## Goal

Fuzzer will generate a random slice of bytes until it panics. It is 
useful for integration tests, and making sure public functions work as intended,
even with extreme input.

## Running Fuzzers

1. `cargo fuzz list -> <NAME>`

2. `make fuzzy <NAME>`

## Writing Fuzzing tests

1. Create new file in fuzz_targets

2. Add boilerplate:

    ```rs
    #![no_main]
    use libfuzzer_sys::fuzz_target;
    use solana_fluidity_fuzz::{setup_keys, process_instruction};
    use fluidity;

    fuzz_target!(|data: &[u8]| {
        // Code here
    });
    ```

3. Add fuzzer to `fuzz/Cargo.toml`

    ```toml
    [[bin]]
    name = "<NAME>"
    path = "fuzz_targets/<NAME>.rs"
    test = false
    doc = false
    ```
