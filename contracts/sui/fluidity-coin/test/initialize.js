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
} = require('./helpers/constants');

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function initialize() {
    console.log('Executing Initialize...');

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    let key = fromB64(process.env.DEPLOYER_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Caller address", await signer.toSuiAddress());

    const status = tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::initialize`,
      arguments: [tx.object(ADMIN_CAP), tx.object(GLOBAL)],
      typeArguments: [SUI_TYPE_ARG],
    });
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

initialize().catch(console.error);
