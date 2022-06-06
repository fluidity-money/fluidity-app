//! Creates an [EpochGaugeVoter].

use crate::*;
use num_traits::ToPrimitive;

/// Accounts for [gauge::prepare_epoch_gauge_voter].
#[derive(Accounts)]
pub struct PrepareEpochGaugeVoter<'info> {
    #[account(has_one = locker)]
    pub gaugemeister: Account<'info, Gaugemeister>,
    pub locker: Account<'info, locked_voter::Locker>,
    #[account(has_one = locker)]
    pub escrow: Account<'info, locked_voter::Escrow>,

    /// [GaugeVoter].
    #[account(has_one = gaugemeister, has_one = escrow)]
    pub gauge_voter: Account<'info, GaugeVoter>,

    /// The [EpochGaugeVoter].
    #[account(
        init,
        seeds = [
            b"EpochGaugeVoter".as_ref(),
            gauge_voter.key().as_ref(),
            gaugemeister.voting_epoch()?.to_le_bytes().as_ref()
        ],
        bump,
        space = 8 + EpochGaugeVoter::LEN,
        payer = payer
    )]
    pub epoch_gauge_voter: Account<'info, EpochGaugeVoter>,

    /// Payer.
    #[account(mut)]
    pub payer: Signer<'info>,

    /// System program.
    pub system_program: Program<'info, System>,
}

impl<'info> PrepareEpochGaugeVoter<'info> {
    /// Calculates the voting power.
    fn power(&self) -> Option<u64> {
        self.escrow.voting_power_at_time(
            &self.locker.params,
            self.gaugemeister.next_epoch_starts_at.to_i64()?,
        )
    }
}

pub fn handler(ctx: Context<PrepareEpochGaugeVoter>) -> Result<()> {
    let voting_epoch = ctx.accounts.gaugemeister.voting_epoch()?;
    let voting_power = unwrap_int!(ctx.accounts.power());

    let epoch_gauge_voter = &mut ctx.accounts.epoch_gauge_voter;
    epoch_gauge_voter.gauge_voter = ctx.accounts.gauge_voter.key();
    epoch_gauge_voter.voting_epoch = voting_epoch;
    epoch_gauge_voter.weight_change_seqno = ctx.accounts.gauge_voter.weight_change_seqno;
    epoch_gauge_voter.voting_power = voting_power;
    epoch_gauge_voter.allocated_power = 0;

    emit!(PrepareEpochGaugeVoterEvent {
        gaugemeister: ctx.accounts.gaugemeister.key(),
        locker: ctx.accounts.locker.key(),
        gauge_voter_owner: ctx.accounts.gauge_voter.owner,
        voting_epoch,
        voting_power,
        weight_change_seqno: epoch_gauge_voter.weight_change_seqno,
    });

    Ok(())
}

impl<'info> Validate<'info> for PrepareEpochGaugeVoter<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.gaugemeister.locker, self.locker);
        assert_keys_eq!(self.escrow, self.gauge_voter.escrow);
        assert_keys_eq!(self.escrow.locker, self.locker);
        assert_keys_eq!(self.escrow.owner, self.gauge_voter.owner);

        Ok(())
    }
}

/// Event called in [gauge::prepare_epoch_gauge_voter].
#[event]
pub struct PrepareEpochGaugeVoterEvent {
    #[index]
    /// The [Gaugemeister].
    pub gaugemeister: Pubkey,
    #[index]
    /// The assocated [locked_voter::Locker].
    pub locker: Pubkey,
    #[index]
    /// The owner of the [GaugeVoter].
    pub gauge_voter_owner: Pubkey,
    /// The epoch that the [GaugeVoter] is voting for.
    pub voting_epoch: u32,
    /// The total amount of voting power.
    pub voting_power: u64,
    /// The [GaugeVoter::weight_change_seqno] at the time of creating the [EpochGaugeVoter].
    pub weight_change_seqno: u64,
}
