//! Struct definitions for accounts that hold state.

use anchor_lang::solana_program::pubkey::PUBKEY_BYTES;

use crate::*;

/// Manages the rewards shares of all [Gauge]s of a [quarry_mine::rewarder].
#[account]
#[derive(Copy, Debug, Default)]
pub struct Gaugemeister {
    /// Base.
    pub base: Pubkey,
    /// Bump seed.
    pub bump: u8,

    /// The Rewarder.
    pub rewarder: Pubkey,
    /// The Utility Mining Authority.
    pub operator: Pubkey,
    /// The [locked_voter::Locker].
    pub locker: Pubkey,

    /// Account which may enable/disable gauges on the [Gaugemeister].
    /// May call the following instructions:
    /// - gauge_enable
    /// - gauge_disable
    pub foreman: Pubkey,
    /// Number of seconds per rewards epoch.
    /// This may be modified later.
    /// The epoch duration is not exact, as epochs must manually be incremented.
    pub epoch_duration_seconds: u32,

    /// The current rewards epoch.
    pub current_rewards_epoch: u32,
    /// When the next epoch starts.
    pub next_epoch_starts_at: u64,

    /// Token mint. Unused but useful for frontends.
    pub locker_token_mint: Pubkey,
    /// Governor associated with the Locker. Unused but useful for frontends.
    pub locker_governor: Pubkey,
}

impl Gaugemeister {
    /// Length of a [Gaugemeister] in bytes.
    pub const LEN: usize = PUBKEY_BYTES + 1 + PUBKEY_BYTES * 4 + 4 + 4 + 8 + PUBKEY_BYTES * 2;

    /// Fetches the current voting epoch. This is always the epoch after [Self::current_rewards_epoch].
    pub fn voting_epoch(&self) -> Result<u32> {
        let voting_epoch = unwrap_int!(self.current_rewards_epoch.checked_add(1));
        Ok(voting_epoch)
    }
}

/// A [Gauge] determines the rewards shares to give to a [quarry_mine::Quarry].
#[account]
#[derive(Copy, Debug, Default)]
pub struct Gauge {
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    /// The [quarry_mine::Quarry] being voted on.
    pub utility_mine: Pubkey,
    /// If true, this Gauge cannot receive any more votes
    /// and rewards shares cannot be synchronized from it.
    pub is_disabled: bool,
}

impl Gauge {
    /// Length of a [Gauge] in bytes.
    pub const LEN: usize = PUBKEY_BYTES * 2 + 1;
}

/// A [GaugeVoter] represents an [locked_voter::Escrow] that can vote on gauges.
#[account]
#[derive(Copy, Debug, Default)]
pub struct GaugeVoter {
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    /// The Escrow of the [GaugeVoter].
    pub escrow: Pubkey,

    /// Owner of the Escrow of the [GaugeVoter].
    pub owner: Pubkey,
    /// Total number of parts that the voter has distributed.
    pub total_weight: u32,
    /// This number gets incremented whenever weights are changed.
    /// Use this to determine if votes must be re-committed.
    ///
    /// This is primarily used when provisioning an [EpochGaugeVoter]:
    /// 1. When one wants to commit their votes, they call [gauge::prepare_epoch_gauge_voter]
    /// 2. The [Self::weight_change_seqno] gets written to [EpochGaugeVoter::weight_change_seqno].
    /// 3. In [gauge::gauge_commit_vote], if the [Self::weight_change_seqno] has changed, the transaction is blocked with a [crate::ErrorCode::WeightSeqnoChanged] error.
    pub weight_change_seqno: u64,
}

impl GaugeVoter {
    /// Length of a [GaugeVoter] in bytes.
    pub const LEN: usize = PUBKEY_BYTES * 3 + 4 + 8;
}

/// A [GaugeVote] is a user's vote for a given [Gauge].
#[account]
#[derive(Copy, Debug, Default)]
pub struct GaugeVote {
    /// The [GaugeVoter].
    pub gauge_voter: Pubkey,
    /// The [Gauge] being voted on.
    pub gauge: Pubkey,

    /// Proportion of votes that the voter is applying to this gauge.
    pub weight: u32,
}

impl GaugeVote {
    /// Length of a [GaugeVote] in bytes.
    pub const LEN: usize = PUBKEY_BYTES * 2 + 4;
}

/// An [EpochGauge] is a [Gauge]'s total committed votes for a given epoch.
///
/// Seeds:
/// ```text
/// [
///     b"EpochGauge".as_ref(),
///     gauge.key().as_ref(),
///     voting_epoch.to_le_bytes().as_ref()
/// ],
/// ```
#[account]
#[derive(Copy, Debug, Default)]
pub struct EpochGauge {
    /// The [Gauge].
    pub gauge: Pubkey,
    /// The epoch associated with this [EpochGauge].
    pub voting_epoch: u32,
    /// The total number of power to be applied to the latest voted epoch.
    /// If this number is non-zero, vote weights cannot be changed until they are all withdrawn.
    pub total_power: u64,
}

impl EpochGauge {
    /// Length of an [EpochGauge] in bytes.
    pub const LEN: usize = PUBKEY_BYTES + 4 + 8;
}

/// An [EpochGaugeVoter] is a [GaugeVoter]'s total committed votes for a
/// given [Gauge] at a given epoch.
#[account]
#[derive(Copy, Debug, Default)]
pub struct EpochGaugeVoter {
    /// The [GaugeVoter].
    pub gauge_voter: Pubkey,
    /// The epoch that the [GaugeVoter] is voting for.
    pub voting_epoch: u32,
    /// The [GaugeVoter::weight_change_seqno] at the time of creating the [EpochGaugeVoter].
    /// If this number is not equal to the [GaugeVoter::weight_change_seqno],
    /// this commitment is stale and must be reset before applying any new votes for this epoch.
    pub weight_change_seqno: u64,
    /// The total amount of voting power.
    pub voting_power: u64,
    /// The total amount of gauge voting power that has been allocated.
    /// If this number is non-zero, vote weights cannot be changed until they are all withdrawn.
    pub allocated_power: u64,
}

impl EpochGaugeVoter {
    /// Length of an [EpochGaugeVoter] in bytes.
    pub const LEN: usize = PUBKEY_BYTES + 4 + 8 * 3;
}

/// An [EpochGaugeVote] is a user's committed votes for a given [Gauge] at a given epoch.
///
/// Seeds:
/// ```text
/// [
///     b"EpochGaugeVote",
///     gauge_vote.key().as_ref(),
///     voting_epoch.to_le_bytes().as_ref(),
/// ];
/// ```
#[account]
#[derive(Copy, Debug, Default)]
pub struct EpochGaugeVote {
    /// The rewards share used to vote for the derived epoch.
    /// This is calculated from:
    /// ```rs
    /// vote_power_at_expiry * (weight / total_weight)
    /// ```
    pub allocated_power: u64,
}

impl EpochGaugeVote {
    /// Length of an [EpochGaugeVote] in bytes.
    pub const LEN: usize = 8;
}

impl EpochGaugeVote {
    /// Finds the address of an [EpochGaugeVote] for a given [GaugeVote] and voting epoch.
    pub fn find_program_address(gauge_vote: &Pubkey, voting_epoch: u32) -> (Pubkey, u8) {
        let epoch_bytes = voting_epoch.to_le_bytes();
        Pubkey::find_program_address(
            &[b"EpochGaugeVote", gauge_vote.as_ref(), epoch_bytes.as_ref()],
            &crate::ID,
        )
    }
}

#[cfg(test)]
#[allow(clippy::unwrap_used)]
mod tests {
    use super::*;

    #[test]
    fn test_gaugemeister_len() {
        assert_eq!(
            Gaugemeister::default().try_to_vec().unwrap().len(),
            Gaugemeister::LEN
        );
    }

    #[test]
    fn test_gauge_voter_len() {
        assert_eq!(
            GaugeVoter::default().try_to_vec().unwrap().len(),
            GaugeVoter::LEN
        );
    }

    #[test]
    fn test_gauge_len() {
        assert_eq!(Gauge::default().try_to_vec().unwrap().len(), Gauge::LEN);
    }

    #[test]
    fn test_gauge_vote_len() {
        assert_eq!(
            GaugeVote::default().try_to_vec().unwrap().len(),
            GaugeVote::LEN
        );
    }

    #[test]
    fn test_epoch_gauge_voter_len() {
        assert_eq!(
            EpochGaugeVoter::default().try_to_vec().unwrap().len(),
            EpochGaugeVoter::LEN
        );
    }

    #[test]
    fn test_epoch_gauge_len() {
        assert_eq!(
            EpochGauge::default().try_to_vec().unwrap().len(),
            EpochGauge::LEN
        );
    }

    #[test]
    fn test_epoch_gauge_vote_len() {
        assert_eq!(
            EpochGaugeVote::default().try_to_vec().unwrap().len(),
            EpochGaugeVote::LEN
        );
    }
}
