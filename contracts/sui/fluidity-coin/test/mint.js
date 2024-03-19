const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { fromB64 } = require('@mysten/bcs');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
  CONTRACT_ID,
  GLOBAL,
  FLUIDITY_COIN_TREASURY_CAP,
  COIN_RESERVE,
  ADMIN_CAP,
  DECIMALS
} = require('./helpers/constants');

require('dotenv').config();

// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function mint() {
    console.log('Minting coins...');

    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);

    let key = fromB64(process.env.DEPLOYER_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    console.log("Caller address", await signer.toSuiAddress());

    tx.moveCall({
      target: `${CONTRACT_ID}::fluidity_coin::mint`,
      arguments: [
        tx.object(FLUIDITY_COIN_TREASURY_CAP),
        tx.object(ADMIN_CAP),
        tx.object(GLOBAL),
        tx.object(COIN_RESERVE),
        tx.pure(amount * 10 ** DECIMALS),
      ],
      typeArguments: [],
    });
    let executeTxn = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: signer,
      options: {
          showEffects: true,
          showObjectChanges: true,
      },
    });
    extractTransactionStatusAndError(executeTxn);
}

// Check if an amount is provided
if (process.argv.length < 3) {
  console.log("Usage: node test/mint.js <amount>");
  process.exit(1);
}

const amount = Number(process.argv[2]);

if (isNaN(amount)) {
  console.log("Please provide a valid number for the amount.");
  process.exit(1);
}

mint(amount).catch(console.error);
