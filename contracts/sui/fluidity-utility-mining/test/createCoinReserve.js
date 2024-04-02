const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { fromB64 } = require('@mysten/bcs');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { CONTRACT_ID, ADMIN_CAP } = require('./helpers/constants');
const {
    SUI_TYPE_ARG,
} = require("@mysten/sui.js/utils");

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function createCoinReserve() {
    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);

    let key = fromB64(process.env.ADMIN_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    let wallet = await signer.toSuiAddress();
    console.log("Caller address", wallet)

    tx.moveCall({
        target: `${CONTRACT_ID}::fluidity_utility_mining::create_coin_reserve`,
        typeArguments: [SUI_TYPE_ARG], // Specify the underlying coin type here
        arguments: [
            tx.object(ADMIN_CAP),
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

    console.log("Transaction executed:", executeTxn);
}

createCoinReserve().catch(console.error);
