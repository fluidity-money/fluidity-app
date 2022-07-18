//! Macros

/// Generates the signer seeds for a Gaugemeister.
#[macro_export]
macro_rules! gaugemeister_seeds {
    ($gm: expr) => {
        &[&[b"Gaugemeister" as &[u8], &$gm.base.to_bytes(), &[$gm.bump]]]
    };
}
