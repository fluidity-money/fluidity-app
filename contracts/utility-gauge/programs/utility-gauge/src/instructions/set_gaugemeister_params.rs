use crate::*;

/// Accounts for [gauge::reset_epoch_gauge_voter].
#[derive(Accounts)]
pub struct SetGaugemeisterParams<'info> {
    #[account(mut)]
    /// The [Gaugemeister] to modify
    pub gaugemeister: Account<'info, Gaugemeister>,
    /// The [Gaugemeister]'s foreman.
    pub foreman: Signer<'info>,
}

impl<'info> Validate<'info> for SetGaugemeisterParams<'info> {
    fn validate(&self) -> Result<()> {
        assert_keys_eq!(self.foreman, self.gaugemeister.foreman);

        Ok(())
    }
}

pub fn handler(
    ctx: Context<SetGaugemeisterParams>,
    new_epoch_duration_seconds: u32,
    new_foreman: Pubkey,
) -> Result<()> {
    let gaugemeister = &mut ctx.accounts.gaugemeister;
    let prev_foreman = gaugemeister.foreman;
    let prev_epoch_duration_seconds = gaugemeister.epoch_duration_seconds;

    gaugemeister.foreman = new_foreman;
    gaugemeister.epoch_duration_seconds = new_epoch_duration_seconds;

    emit!(SetGaugemeisterParamsEvent {
        prev_foreman,
        new_foreman: gaugemeister.foreman,
        prev_epoch_duration_seconds,
        new_epoch_duration_seconds: gaugemeister.epoch_duration_seconds
    });

    Ok(())
}

/// Event called in [gauge::set_gaugemeister_params].
#[event]
struct SetGaugemeisterParamsEvent {
    prev_foreman: Pubkey,
    new_foreman: Pubkey,
    prev_epoch_duration_seconds: u32,
    new_epoch_duration_seconds: u32,
}
