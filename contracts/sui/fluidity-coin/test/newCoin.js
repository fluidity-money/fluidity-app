const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { fromB64 } = require('@mysten/bcs');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
  SUI_TYPE_ARG,
} = require("@mysten/sui.js/utils");

require('dotenv').config();

const {
    CONTRACT_ID,
    GLOBAL,
    ADMIN_CAP,
    SCALLOP_MARKET,
    SCALLOP_VERSION
} = require('./helpers/constants');

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function newCoin() {
    console.log('Executing NewCoin...');

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    let key = fromB64(process.env.DEPLOYER_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Caller address", await signer.toSuiAddress());

    tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::new_coin`,
      arguments: [
        tx.object(SCALLOP_MARKET),
        tx.object(SCALLOP_VERSION),
        9,
        "FLUID SUI",
        "fSUI",
        "Fluid Sui is a Fluid Asset wrapped form of Sui. Use the app at https://app.fluidity.money",
        ""
      ],
      typeArguments: [SUI_TYPE_ARG],
    });
    return;
    let executeTxn = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: signer,
      options: {
          showEffects: true,
          showObjectChanges: true,
      },
    });
    console.log("Transaction executed:", executeTxn);
    extractTransactionStatusAndError(executeTxn);
}

newCoin().catch(console.error);
