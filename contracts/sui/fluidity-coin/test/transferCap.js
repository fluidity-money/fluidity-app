const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { fromB64 } = require('@mysten/bcs');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
    CONTRACT_ID,
    ADMIN_CAP,
    WORKER_CAP,
    EMERGENCY_CAP,
    DAO_CAP
} = require('./helpers/constants');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function transferCap(capType, recipientAddress) {
    console.log(`Transferring ${capType} Cap...`);

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    let key = fromB64(process.env.DEPLOYER_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Caller address", await signer.toSuiAddress());

    // Determine the cap object and function name based on capType
    let capObject, functionName;
    switch (capType.toLowerCase()) {
        case 'worker':
            capObject = WORKER_CAP;
            functionName = 'transfer_worker_cap';
            break;
        case 'emergency':
            capObject = EMERGENCY_CAP;
            functionName = 'transfer_emergency_cap';
            break;
        case 'dao':
            capObject = DAO_CAP;
            functionName = 'transfer_dao_cap';
            break;
        default:
            console.error(`Invalid cap type: ${capType}`);
            process.exit(1);
    }

    tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::${functionName}`,
      arguments: [
        tx.object(ADMIN_CAP),
        tx.object(capObject),
        tx.pure(recipientAddress),
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

// Usage: node transfer_cap.js <capType> <recipientAddress>
if (process.argv.length < 4) {
    console.log("Usage: node transfer_cap.js <capType> <recipientAddress>");
    console.log("<capType> can be 'worker', 'emergency', or 'dao'");
    process.exit(1);
}

const [capType, recipientAddress] = process.argv.slice(2);
transferCap(capType, recipientAddress).catch(console.error);
