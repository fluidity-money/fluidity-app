use std::env;

use fluidity_testing_cli::{
    test_smart_contract,
    utils::{ConfigOptions, SolendAccounts},
    TestingCommands,
};
use solana_client::rpc_client::RpcClient;
use solana_sdk::signer::Signer;

fn main() {
    let mut config = ConfigOptions::new();
    println!("payer pubkey: {}", config.payer.as_ref().unwrap().pubkey());
    println!("");

    let solend_accounts = SolendAccounts::new(&config.solend_account_file);

    config.derive_solend_accounts(&solend_accounts);

    let client = RpcClient::new(config.solana_node_address.clone());

    let command = match env::args().nth(1).unwrap().as_str() {
        "wrap" => TestingCommands::Wrap(env::args().nth(2).unwrap().parse::<u64>().unwrap()),
        "unwrap" => TestingCommands::Unwrap(env::args().nth(2).unwrap().parse::<u64>().unwrap()),
        "payout" => TestingCommands::Payout(env::args().nth(2).unwrap().parse::<u64>().unwrap()),
        "movefromprizepool" => {
            TestingCommands::MoveFromPrizePool(env::args().nth(2).unwrap().parse::<u64>().unwrap())
        }
        "logtvl" => TestingCommands::LogTvl,
        "initobligation" => TestingCommands::InitObligation,
        "initdata" => TestingCommands::InitData,
        "inittvldata" => TestingCommands::InitTvlData,
        "printpdakeys" => TestingCommands::PrintPdaKeys,
        "dumpallkeys" => TestingCommands::DumpKeys,
        _ => TestingCommands::Help,
    };

    // test smart contract functions
    test_smart_contract(
        &config,
        &solend_accounts,
        &client,
        command,
        if let Some(sim) = config.simulate {
            sim
        } else {
            false
        },
    );
}
