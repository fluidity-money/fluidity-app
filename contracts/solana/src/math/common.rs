//! Common module for Decimal and Rate

use solana_program::program_error::ProgramError;

/// Scale of precision
pub const SCALE: usize = 18;

/// Identity
pub const WAD: u64 = 1_000_000_000_000_000_000;

/// Half of identity
#[allow(dead_code)]
pub const HALF_WAD: u64 = 500_000_000_000_000_000;

/// Scale for percentages
#[allow(dead_code)]
pub const PERCENT_SCALER: u64 = 10_000_000_000_000_000;

/// Try to subtract, return an error on underflow
pub trait TrySub: Sized {
    /// Subtract
    fn try_sub(self, rhs: Self) -> Result<Self, ProgramError>;
}

/// Try to subtract, return an error on overflow
pub trait TryAdd: Sized {
    /// Add
    fn try_add(self, rhs: Self) -> Result<Self, ProgramError>;
}

/// Try to divide, return an error on overflow or divide by zero
pub trait TryDiv<RHS>: Sized {
    /// Divide
    fn try_div(self, rhs: RHS) -> Result<Self, ProgramError>;
}

/// Try to multiply, return an error on overflow
pub trait TryMul<RHS>: Sized {
    /// Multiply
    fn try_mul(self, rhs: RHS) -> Result<Self, ProgramError>;
}

#[cfg(test)]
mod test {
    use super::*;
    use num_traits::checked_pow;

    #[test]
    fn test_scale_wad() {
        assert_eq!(checked_pow(10u64, SCALE).unwrap(), WAD);
    }

    #[test]
    fn test_scale_half_wad() {
        assert_eq!(checked_pow(10u64, SCALE).unwrap(), HALF_WAD * 2);
    }

    #[test]
    fn test_scale_percent() {
        assert_eq!(checked_pow(10u64, SCALE).unwrap(), PERCENT_SCALER * 100);
    }
}
