use std::str::FromStr;

use borsh::{BorshDeserialize, BorshSerialize};
use serde::Deserialize;
use solana_sdk::{
    pubkey::Pubkey,
    signature::Keypair,
    signer::{keypair, Signer},
};
use spl_associated_token_account::get_associated_token_address;

// struct defining fludity data account
#[derive(BorshDeserialize, BorshSerialize, Debug, PartialEq, Clone)]
pub struct FluidityData {
    token_mint: Pubkey,
    fluid_mint: Pubkey,
    pda: Pubkey,
}

#[derive(BorshSerialize)]
pub enum FluidityInstruction {
    Wrap(u64, String, u8),
    Unwrap(u64, String, u8),
    Payout(u64, String, u8),
    InitSolendObligation(u64, u64, String, u8),
    LogTVL,
    InitData(String, u64, u64, u8),
    MoveFromPrizePool(u64, String, u8),
}

#[derive(Deserialize, Debug)]
struct DevnetAccount {
    pub public_key: String,
    pub private_key: [u8; 32],
    #[serde(skip)]
    pub keypair: Option<Keypair>,
    #[serde(skip)]
    pub base_token_account: Option<String>,
    #[serde(skip)]
    pub fluid_token_account: Option<String>,
    #[serde(skip)]
    pub tvl_data_account: Option<String>,
}

#[derive(Deserialize, Debug)]
#[serde(transparent)]
struct DevnetAccounts {
    pub accounts: Vec<DevnetAccount>,
}

impl DevnetAccounts {
    pub fn new(file: &str) -> Self {
        match serde_json::from_reader(std::fs::File::open(file).unwrap()) {
            Ok(accs) => accs,
            Err(e) => panic!("Failed to load Devnet accounts: {:#?}", e),
        }
    }

    pub fn derive_accounts(&mut self, program_id: &Pubkey, token_mint: &str, fluidity_mint: &str) {
        let tvl_data_seed = "FLU:TVL_DATA";

        for account in self.accounts.iter_mut() {
            let acc_keypair = keypair::keypair_from_seed(&account.private_key).unwrap();

            account.keypair = Some(acc_keypair);

            account.tvl_data_account = Some(
                Pubkey::create_with_seed(&acc_keypair.pubkey(), &tvl_data_seed, program_id)
                    .unwrap()
                    .to_string(),
            );

            // if not provided, figure out token accounts
            account.base_token_account = Some(
                get_associated_token_address(
                    &acc_keypair.pubkey(),
                    &Pubkey::from_str(token_mint).unwrap(),
                )
                .to_string(),
            );

            account.fluid_token_account = Some(
                get_associated_token_address(
                    &acc_keypair.pubkey(),
                    &Pubkey::from_str(fluidity_mint).unwrap(),
                )
                .to_string(),
            );
        }
    }
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct ConfigOptions {
    pub solana_node_address: String,
    pub solana_id_path: String,
    #[serde(skip)]
    pub accounts: Vec<DevnetAccount>,
    #[serde(rename = "slnd_common")]
    pub solend_account_file: String,
    #[serde(rename = "flu_program_id")]
    pub program_id: String,
    #[serde(skip)]
    pub pda_account: String,
    #[serde(rename = "flu_token_name")]
    pub token_name: String,
    #[serde(rename = "flu_token_mint")]
    pub token_mint: String,
    #[serde(rename = "flu_fluid_mint")]
    pub fluidity_mint: String,
    #[serde(rename = "flu_pda_obligation")]
    pub pda_obligation: Option<String>,
    #[serde(rename = "flu_pda_collateral")]
    pub pda_collateral: Option<String>,
    #[serde(skip)]
    pub data_account: String,
    #[serde(rename = "flu_simulate")]
    pub simulate: Option<bool>,
}

impl ConfigOptions {
    pub fn new() -> ConfigOptions {
        let mut opts = match envy::from_env::<ConfigOptions>() {
            Ok(env) => env,
            Err(e) => panic!("Failed to load ENV: {:#?}", e),
        };
        opts.derive_accounts();
        opts
    }

    pub fn derive_accounts(&mut self) {
        let program_id = Pubkey::from_str(&self.program_id).unwrap();

        let pda_account_seed = format!("FLU:{}_OBLIGATION", self.token_name);
        let (pda_pubkey, _) =
            Pubkey::find_program_address(&[pda_account_seed.as_bytes()], &program_id);
        self.pda_account = pda_pubkey.to_string();

        // derive address of data account
        let data_account_seed = format!("FLU:{}_DATA", self.token_name);
        self.data_account = Pubkey::create_with_seed(&pda_pubkey, &data_account_seed, &program_id)
            .unwrap()
            .to_string();

        let accounts = DevnetAccounts::new(&self.solana_id_path);

        accounts.derive_accounts(&program_id, &self.token_mint, &self.fluidity_mint);
    }

    pub fn derive_solend_accounts(&mut self, solend_accounts: &SolendAccounts) {
        let pda_pubkey = Pubkey::from_str(&self.pda_account).unwrap();

        if self.pda_collateral == None {
            self.pda_collateral = Some(
                get_associated_token_address(
                    &pda_pubkey,
                    &Pubkey::from_str(
                        &solend_accounts.markets[0]
                            .reserves
                            .iter()
                            .find(|r| r.asset == self.token_name)
                            .unwrap()
                            .collateralMintAddress,
                    )
                    .unwrap(),
                )
                .to_string(),
            );
        }

        if self.pda_obligation == None {
            self.pda_obligation = Some(
                Pubkey::create_with_seed(
                    &pda_pubkey,
                    &solend_accounts.markets[0].address[0..32],
                    &Pubkey::from_str(&solend_accounts.programID).unwrap(),
                )
                .unwrap()
                .to_string(),
            )
        }
    }
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SolendAsset {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub mintAddress: String,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SolendReserve {
    pub asset: String,
    pub address: String,
    pub collateralMintAddress: String,
    pub collateralSupplyAddress: String,
    pub liquidityAddress: String,
    pub liquidityFeeReceiverAddress: String,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SolendMarket {
    pub name: String,
    pub address: String,
    pub authorityAddress: String,
    pub reserves: Vec<SolendReserve>,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SolendOracleAsset {
    pub asset: String,
    pub priceAddress: String,
    pub switchboardFeedAddress: String,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SolendOracle {
    pub pythProgramID: String,
    pub switchboardProgramID: String,
    pub assets: Vec<SolendOracleAsset>,
}

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
pub struct SolendAccounts {
    pub programID: String,
    pub assets: Vec<SolendAsset>,
    pub markets: Vec<SolendMarket>,
    #[serde(rename = "oracles")]
    pub oracle: SolendOracle,
}

impl SolendAccounts {
    pub fn new(file: &str) -> Self {
        match serde_json::from_reader(std::fs::File::open(file).unwrap()) {
            Ok(accs) => accs,
            Err(e) => panic!("Failed to load Solend accounts: {:#?}", e),
        }
    }
}
