use crate::error::LendingError;
use solana_program::{clock::Slot, program_error::ProgramError};
use std::cmp::Ordering;

/// Number of slots to consider stale after
#[allow(unused)]
pub const STALE_AFTER_SLOTS_ELAPSED: u64 = 1;

/// Last update state
#[derive(Clone, Debug, Default)]
pub struct LastUpdate {
    /// Last slot when updated
    pub slot: Slot,
    /// True when marked stale, false when slot updated
    pub stale: bool,
}

impl LastUpdate {
    /// Create new last update
    #[allow(unused)]
    pub fn new(slot: Slot) -> Self {
        Self { slot, stale: true }
    }

    /// Return slots elapsed since given slot
    #[allow(unused)]
    pub fn slots_elapsed(&self, slot: Slot) -> Result<u64, ProgramError> {
        let slots_elapsed = slot
            .checked_sub(self.slot)
            .ok_or(LendingError::MathOverflow)?;
        Ok(slots_elapsed)
    }

    /// Set last update slot
    #[allow(unused)]
    pub fn update_slot(&mut self, slot: Slot) {
        self.slot = slot;
        self.stale = false;
    }

    /// Set stale to true
    #[allow(unused)]
    pub fn mark_stale(&mut self) {
        self.stale = true;
    }

    /// Check if marked stale or last update slot is too long ago
    #[allow(unused)]
    pub fn is_stale(&self, slot: Slot) -> Result<bool, ProgramError> {
        Ok(self.stale || self.slots_elapsed(slot)? >= STALE_AFTER_SLOTS_ELAPSED)
    }
}

impl PartialEq for LastUpdate {
    fn eq(&self, other: &Self) -> bool {
        self.slot == other.slot
    }
}

impl PartialOrd for LastUpdate {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        self.slot.partial_cmp(&other.slot)
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_init_last_update() {
        let slot_id = 42;
        let new_update = LastUpdate::new(slot_id as Slot);
        assert_eq!(new_update.stale, true);
        assert_eq!(new_update.slot, slot_id as Slot);
    }
}
