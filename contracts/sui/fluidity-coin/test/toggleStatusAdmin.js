const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { fromB64 } = require('@mysten/bcs');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
    CONTRACT_ID,
    ADMIN_CAP,
    GLOBAL
} = require('./helpers/constants');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function toggleStatusAdmin(action) {
    console.log(`Admin is ${action === 'pause' ? 'Pausing Contract' : 'Unpausing Contract'}...`);

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    let key = fromB64(process.env.ADMIN_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Admin address", await signer.toSuiAddress());

    const functionName = action === 'pause' ? 'pause_admin' : 'unpause_admin';

    tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::${functionName}`,
      arguments: [
        tx.object(ADMIN_CAP),
        tx.object(GLOBAL)
      ],
      typeArguments: [],
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

// Usage: node toggleStatusAdmin.js <action>
// <action> can be 'pause' or 'unpause'
if (process.argv.length < 3) {
    console.log("Usage: node toggleStatusAdmin.js <action>");
    console.log("<action> can be 'pause' or 'unpause'");
    process.exit(1);
}

const action = process.argv[2];
if (!['pause', 'unpause'].includes(action)) {
    console.log("Invalid action. Use 'pause' or 'unpause'.");
    process.exit(1);
}

toggleStatusAdmin(action).catch(console.error);