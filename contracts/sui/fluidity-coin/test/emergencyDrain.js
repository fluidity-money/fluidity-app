const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { fromB64 } = require('@mysten/bcs');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
    SUI_TYPE_ARG,
    SUI_CLOCK_OBJECT_ID,
} = require("@mysten/sui.js/utils");
const {
    CONTRACT_ID,
    DAO_CAP,
    PRIZE_POOL_VAULT,
    SCALLOP_VERSION,
    SCALLOP_MARKET,
} = require('./helpers/constants');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function emergencyDrain() {
    console.log("Initiating emergency drain of the Prize Pool Vault...");

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    let key = fromB64(process.env.DAO_PRIVATE_KEY).slice(1); // Use the DAO's private key for authorization
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("DAO address", await signer.toSuiAddress());

    tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::emergency_drain_prize_pool_vault`,
      arguments: [
        tx.object(DAO_CAP),
        tx.object(PRIZE_POOL_VAULT),
        tx.object(SCALLOP_VERSION),
        tx.object(SCALLOP_MARKET),
        tx.object(SUI_CLOCK_OBJECT_ID)
      ],
      typeArguments: [SUI_TYPE_ARG],
    });

    const executeTxn = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: signer,
      options: {
          showEffects: true,
          showObjectChanges: true,
      },
    });
    extractTransactionStatusAndError(executeTxn);
}

emergencyDrain().catch(console.error);
