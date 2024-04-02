const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { fromB64 } = require('@mysten/bcs');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { CONTRACT_ID, ADMIN_CAP, COIN_RESERVE_SUI_ID } = require('./helpers/constants'); // Define COIN_RESERVE_ID in your constants
const { SUI_TYPE_ARG,  SUI_DECIMALS } = require("@mysten/sui.js/utils");
const { extractTransactionStatusAndError } = require('./helpers/utils');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function addToReserve() {
    let tx = new TransactionBlock();
    tx.setGasBudget(100000000);

    let key = fromB64(process.env.ADMIN_PRIVATE_KEY).slice(1);
    let signer = Ed25519Keypair.fromSecretKey(key);
    let wallet = await signer.toSuiAddress();
    console.log("Caller address", wallet)

    const [input_amt] = tx.splitCoins(
        tx.gas,
        [tx.pure(amount * 10 ** SUI_DECIMALS)]
      )
    tx.transferObjects([input_amt], tx.pure(wallet));
    let executeTxn = await suiClient.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      signer: signer,
      options: {
          showEffects: true,
          showObjectChanges: true,
      },
    });
    extractTransactionStatusAndError(executeTxn);
  
    const userSuiCoins = (await suiClient.getCoins({
      owner: wallet,
      coinType: SUI_TYPE_ARG,
    })).data;
    console.log(userSuiCoins)

    tx = new TransactionBlock();
    tx.setGasBudget(100000000);

    // Assuming the coin to add is already owned by the admin
    tx.moveCall({
        target: `${CONTRACT_ID}::fluidity_utility_mining::add_to_reserve`,
        typeArguments: [SUI_TYPE_ARG], // Specify the underlying coin type here
        arguments: [
            tx.object(ADMIN_CAP),
            tx.object(COIN_RESERVE_SUI_ID),
            tx.object(userSuiCoins[1].coinObjectId),
        ],
    });

    executeTxn = await suiClient.signAndExecuteTransactionBlock({
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
    console.log("Assumes SUI coin type interactions for this test")
    console.log("Usage: node test/addToReserve.js <amount>");
    process.exit(1);
}

const amount = Number(process.argv[2]);

if (isNaN(amount)) {
    console.log("Please provide a valid number for the amount.");
    process.exit(1);
}

addToReserve(amount).catch(console.error);
  
