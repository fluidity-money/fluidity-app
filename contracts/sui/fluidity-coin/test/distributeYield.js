const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { fromB64 } = require('@mysten/bcs');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
    CONTRACT_ID,
    WORKER_CAP,
    PRIZE_POOL_VAULT,
    SCALLOP_VERSION,
    SCALLOP_MARKET,
    CLOCK_OBJECT
} = require('./helpers/constants');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function distributeYield(recipients, amounts) {
    console.log("Distributing yield to recipients...");

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    let key = fromB64(process.env.WORKER_PRIVATE_KEY).slice(1); // Use the Worker's private key for authorization
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Worker address", await signer.toSuiAddress());
    const adjustedAmountsForDecimals = amounts.map(amount => amount * Math.pow(10, SUI_DECIMALS));
    tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::distribute_yield`,
      arguments: [
        tx.object(WORKER_CAP),
        tx.object(PRIZE_POOL_VAULT),
        tx.object(SCALLOP_VERSION),
        tx.object(SCALLOP_MARKET),
        tx.object(CLOCK_OBJECT),
        tx.pure(recipients),
        tx.pure(adjustedAmountsForDecimals),
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

// Usage: node distributeYield.js "recipient1,recipient2" "amount1,amount2"
if (process.argv.length < 4) {
    console.log("Usage: node distributeYield.js \"recipient1,recipient2\" \"amount1,amount2\"");
    process.exit(1);
}

const recipients = process.argv[2].split(",");
const amounts = process.argv[3].split(",");
if (recipients.length !== amounts.length) {
    console.log("Error: The number of recipients and amounts must match.");
    process.exit(1);
}

distributeYield(recipients, amounts).catch(console.error);