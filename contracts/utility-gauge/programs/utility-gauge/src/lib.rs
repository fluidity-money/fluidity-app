//! Allows Tribeca Voting Escrows to vote on token allocations between different Quarries.
//!
//! Detailed documentation is available on the [Tribeca documentation site.](https://docs.tribeca.so/features/gauges)
//!
//! # License
//!
//! The Quarry Gauge program and SDK are distributed under the Affero GPL v3.0 license.
#![deny(rustdoc::all)]
#![allow(rustdoc::missing_doc_code_examples)]
#![deny(clippy::unwrap_used)]
#![allow(deprecated)]

use anchor_lang::prelude::*;
use vipers::prelude::*;

mod instructions;
mod macros;
mod state;

pub use state::*;

use instructions::*;

declare_id!("GijCvpzEK5wQjFtekuYifb8KU3xtVERFP3mFrhf8fNNV");

/// The [utility_gauge] program.
#[program]
pub mod utility_gauge {

    use super::*;

    /// Creates a [Gaugemeister].
    #[access_control(ctx.accounts.validate())]
    #[deprecated(note = "Use `create_gaugemeister_v2` instead.")]
    pub fn create_gaugemeister(
        ctx: Context<CreateGaugemeister>,
        _bump: u8,
        foreman: Pubkey,
        epoch_duration_seconds: u32,
        first_epoch_starts_at: u64,
    ) -> Result<()> {
        create_gaugemeister::handler(ctx, foreman, epoch_duration_seconds, first_epoch_starts_at)
    }

    /// Creates a [Gaugemeister].
    ///
    /// The V2 variant removes the need to supply a bump seed.
    #[access_control(ctx.accounts.validate())]
    pub fn create_gaugemeister_v2(
        ctx: Context<CreateGaugemeister>,
        foreman: Pubkey,
        epoch_duration_seconds: u32,
        first_epoch_starts_at: u64,
    ) -> Result<()> {
        create_gaugemeister::handler(ctx, foreman, epoch_duration_seconds, first_epoch_starts_at)
    }

    /// Creates a [Gauge]. Permissionless.
    #[deprecated(note = "Use `create_gauge_v2` instead.")]
    #[access_control(ctx.accounts.validate())]
    pub fn create_gauge(ctx: Context<CreateGauge>, _bump: u8) -> Result<()> {
        create_gauge::handler(ctx)
    }

    /// Creates a [Gauge]. Permissionless.
    ///
    /// The V2 variant removes the need to supply a bump seed.
    #[access_control(ctx.accounts.validate())]
    pub fn create_gauge_v2(ctx: Context<CreateGauge>) -> Result<()> {
        create_gauge::handler(ctx)
    }

    /// Creates a [GaugeVoter]. Permissionless.
    #[deprecated(note = "Use `create_gauge_voter_v2` instead.")]
    #[access_control(ctx.accounts.validate())]
    pub fn create_gauge_voter(ctx: Context<CreateGaugeVoter>, _bump: u8) -> Result<()> {
        create_gauge_voter::handler(ctx)
    }

    /// Creates a [GaugeVoter]. Permissionless.
    ///
    /// The V2 variant removes the need to supply a bump seed.
    #[access_control(ctx.accounts.validate())]
    pub fn create_gauge_voter_v2(ctx: Context<CreateGaugeVoter>) -> Result<()> {
        create_gauge_voter::handler(ctx)
    }

    /// Creates a [GaugeVote]. Permissionless.
    #[deprecated(note = "Use `create_gauge_vote_v2` instead.")]
    #[access_control(ctx.accounts.validate())]
    pub fn create_gauge_vote(ctx: Context<CreateGaugeVote>, _bump: u8) -> Result<()> {
        create_gauge_vote::handler(ctx)
    }

    /// Creates a [GaugeVote]. Permissionless.
    ///
    /// The V2 variant removes the need to supply a bump seed.
    #[access_control(ctx.accounts.validate())]
    pub fn create_gauge_vote_v2(ctx: Context<CreateGaugeVote>) -> Result<()> {
        create_gauge_vote::handler(ctx)
    }

    /// Creates an [EpochGauge]. Permissionless.
    #[access_control(ctx.accounts.validate())]
    pub fn create_epoch_gauge(
        ctx: Context<CreateEpochGauge>,
        _bump: u8,
        voting_epoch: u32,
    ) -> Result<()> {
        create_epoch_gauge::handler(ctx, voting_epoch)
    }

    /// Creates an [EpochGaugeVoter]. Permissionless.
    #[deprecated(note = "Use `prepare_epoch_gauge_voter_v2` instead.")]
    #[access_control(ctx.accounts.validate())]
    pub fn prepare_epoch_gauge_voter(
        ctx: Context<PrepareEpochGaugeVoter>,
        _bump: u8,
    ) -> Result<()> {
        prepare_epoch_gauge_voter::handler(ctx)
    }
    /// Creates an [EpochGaugeVoter]. Permissionless.
    ///
    /// The V2 variant removes the need to supply a bump seed.
    #[access_control(ctx.accounts.validate())]
    pub fn prepare_epoch_gauge_voter_v2(ctx: Context<PrepareEpochGaugeVoter>) -> Result<()> {
        prepare_epoch_gauge_voter::handler(ctx)
    }

    /// Resets an [EpochGaugeVoter]; that is, syncs the [EpochGaugeVoter]
    /// with the latest power amount only if the votes have yet to be
    /// committed. Permissionless.
    #[access_control(ctx.accounts.validate())]
    pub fn reset_epoch_gauge_voter(ctx: Context<ResetEpochGaugeVoter>) -> Result<()> {
        reset_epoch_gauge_voter::handler(ctx)
    }

    /// Sets the vote of a [Gauge].
    #[access_control(ctx.accounts.validate())]
    pub fn gauge_set_vote(ctx: Context<GaugeSetVote>, weight: u32) -> Result<()> {
        gauge_set_vote::handler(ctx, weight)
    }

    /// Commits the vote of a [Gauge].
    /// Anyone can call this on any voter's gauge votes.
    #[deprecated(note = "Use `gauge_commit_vote_v2` instead.")]
    #[access_control(ctx.accounts.validate())]
    pub fn gauge_commit_vote(ctx: Context<GaugeCommitVote>, _vote_bump: u8) -> Result<()> {
        gauge_commit_vote::handler(ctx)
    }

    /// Commits the vote of a [Gauge].
    /// Anyone can call this on any voter's gauge votes.
    ///
    /// The V2 variant removes the need to supply a bump seed.
    #[access_control(ctx.accounts.validate())]
    pub fn gauge_commit_vote_v2(ctx: Context<GaugeCommitVote>) -> Result<()> {
        gauge_commit_vote::handler(ctx)
    }

    /// Reverts a vote commitment of a [Gauge].
    /// Only the voter can call this.
    #[access_control(ctx.accounts.validate())]
    pub fn gauge_revert_vote(ctx: Context<GaugeRevertVote>) -> Result<()> {
        gauge_revert_vote::handler(ctx)
    }

    /// Enables a [Gauge].
    #[access_control(ctx.accounts.validate())]
    pub fn gauge_enable(ctx: Context<GaugeEnable>) -> Result<()> {
        gauge_enable::handler(ctx)
    }

    /// Disables a [Gauge].
    #[access_control(ctx.accounts.validate())]
    pub fn gauge_disable(ctx: Context<GaugeDisable>) -> Result<()> {
        gauge_disable::handler(ctx)
    }

    /// Triggers the next epoch. Permissionless.
    #[access_control(ctx.accounts.validate())]
    pub fn trigger_next_epoch(ctx: Context<TriggerNextEpoch>) -> Result<()> {
        trigger_next_epoch::handler(ctx)
    }

    /// Sets new parameters on the [Gaugemeister].
    /// Only the [Gaugemeister::foreman] may call this.
    #[access_control(ctx.accounts.validate())]
    pub fn set_gaugemeister_params(
        ctx: Context<SetGaugemeisterParams>,
        new_epoch_duration_seconds: u32,
        new_foreman: Pubkey,
    ) -> Result<()> {
        set_gaugemeister_params::handler(ctx, new_epoch_duration_seconds, new_foreman)
    }

    /// Closes an [EpochGaugeVote], sending lamports to a user-specified address.
    ///
    /// Only the [locked_voter::Escrow::vote_delegate] may call this.
    #[access_control(ctx.accounts.validate())]
    pub fn close_epoch_gauge_vote(
        ctx: Context<CloseEpochGaugeVote>,
        voting_epoch: u32,
    ) -> Result<()> {
        instructions::close_epoch_gauge_vote::handler(ctx, voting_epoch)
    }
}

/// Errors.
#[error_code]
pub enum ErrorCode {
    #[msg("You must be the foreman to perform this action.")]
    UnauthorizedNotForeman,
    #[msg("Cannot sync gauges at the 0th epoch.")]
    GaugeEpochCannotBeZero,
    #[msg("The gauge is not set to the current epoch.")]
    GaugeWrongEpoch,
    #[msg("The start time for the next epoch has not yet been reached.")]
    NextEpochNotReached,
    #[msg("Must set all votes to 0 before changing votes.")]
    CannotVoteMustReset,
    #[msg("Cannot vote since gauge is disabled; all you may do is set weight to 0.")]
    CannotVoteGaugeDisabled,
    #[msg("You have already committed your vote to this gauge.")]
    VoteAlreadyCommitted,
    #[msg("Cannot commit votes since gauge is disabled; all you may do is set weight to 0.")]
    CannotCommitGaugeDisabled,
    #[msg("Voting on this epoch gauge is closed.")]
    EpochGaugeNotVoting,
    #[msg("Gauge voter voting weights have been modified since you started committing your votes. Please withdraw your votes and try again.")]
    WeightSeqnoChanged,
    #[msg("You may no longer modify votes for this epoch.")]
    EpochClosed,
    #[msg("You must have zero allocated power in order to reset the epoch gauge.")]
    AllocatedPowerMustBeZero,
    #[msg("The epoch in which you are closing an account for has not yet elapsed.")]
    CloseEpochNotElapsed,
    #[msg("You must be the vote delegate of the escrow to perform this action.")]
    UnauthorizedNotDelegate,
}
