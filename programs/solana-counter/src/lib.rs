use anchor_lang::prelude::*;

declare_id!("CBg8WUVoFPdppuTBDzpUpgY3PG4PbzK8S676PQKXvLy6");

#[program]
pub mod solana_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.authority = *ctx.accounts.authority.key;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).ok_or(ErrorCode::Overflow)?;
        Ok(())
    }
}

#[account]
pub struct Counter {
    pub authority: Pubkey,
    pub count: u64,   
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8, seeds = [b"counter", authority.key().as_ref()], bump)]
    pub counter: Account<'info, Counter>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut, seeds = [b"counter", authority.key().as_ref()], bump, has_one = authority)]
    pub counter: Account<'info, Counter>,

    pub authority: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Overflow")]
    Overflow,
}

