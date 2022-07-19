use std::str::FromStr;

use borsh::BorshDeserialize;
use rpc::{send_txn, simulate_txn};
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    instruction::Instruction, pubkey::Pubkey, signature::Keypair, transaction::Transaction,
};
use utils::{ConfigOptions, SolendAccounts};

use crate::utils::FluidityData;

pub mod instructions;
pub mod rpc;
pub mod utils;

#[derive(Debug)]
pub enum TestingCommands {
    Wrap(u64),
    Unwrap(u64),
    Payout(u64),
    MoveFromPrizePool(u64),
    InitObligation,
    LogTvl,
    InitData,
    InitTvlData,
    Help,
    PrintPdaKeys,
    DumpKeys,
}

pub fn create_transaction(
    client: &RpcClient,
    instructions: Vec<Instruction>,
    payer: Pubkey,
    signers: Vec<&Keypair>,
) {
    // get recent blockhash
    let (recent_blockhash, _) = client.get_recent_blockhash().unwrap();

    let mut txn = Transaction::new_with_payer(&instructions, Some(&payer));
    txn.sign(&signers, recent_blockhash);

    send_txn(&client, txn);
}
