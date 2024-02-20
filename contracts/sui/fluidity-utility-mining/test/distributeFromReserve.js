const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { fromB64 } = require('@mysten/bcs');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { CONTRACT_ID, WORKER_CAP, COIN_RESERVE_SUI_ID } = require('./helpers/constants');
const { SUI_TYPE_ARG } = require("@mysten/sui.js/utils");
const { extractTransactionStatusAndError } = require('./helpers/utils');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function distributeFromReserve() {
    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);

    let key = fromB64(process.env.ADMIN_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Worker address", await signer.toSuiAddress());

    tx.moveCall({
        target: `${CONTRACT_ID}::fluidity_utility_mining::distribute_from_reserve`,
        typeArguments: [SUI_TYPE_ARG], // Adjust if needed for other coin types
        arguments: [
            tx.object(WORKER_CAP),
            tx.object(COIN_RESERVE_SUI_ID),
            tx.pure(recipientAddress),
            tx.pure(amount * 10 ** SUI_DECIMALS),
        ],
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

// Check if recipient address and amount are provided
if (process.argv.length < 4) {
    console.log("Usage: node distributeFromReserve.js <recipientAddress> <amount>");
    process.exit(1);
}

const recipientAddress = process.argv[2];
const amount = Number(process.argv[3]);

if (isNaN(amount)) {
    console.log("Please provide a valid number for the amount.");
    process.exit(1);
}

distributeFromReserve(recipientAddress, amount).catch(console.error);