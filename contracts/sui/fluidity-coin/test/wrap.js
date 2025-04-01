const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
  SUI_TYPE_ARG,
  SUI_CLOCK_OBJECT_ID,
} = require("@mysten/sui.js/utils");
const {
  SUI_DECIMALS,
} = require("@mysten/sui.js/utils");
const {
  SCALLOP_VERSION,
  SCALLOP_MARKET,
  CONTRACT_ID,
  GLOBAL,
  USER_VAULT,
  COIN_RESERVE,
} = require('./helpers/constants');

require('dotenv').config();

// create a new SuiClient object pointing to the network you want to use
const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function wrapCoins() {
  let privateKeyBuffer = Buffer.from(process.env.USER_PRIVATE_KEY.slice(2), 'hex');
  let signer = Ed25519Keypair.fromSecretKey(privateKeyBuffer);
  let wallet = await signer.toSuiAddress();
  console.log("Caller address", wallet)

  let tx = new TransactionBlock(); 
  tx.setGasBudget(100000000);

  console.log("Splitting user coins")
  
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

  tx = new TransactionBlock();
  tx.setGasBudget(100000000);

  const userSuiCoins = (await suiClient.getCoins({
    owner: wallet,
    coinType: SUI_TYPE_ARG,
  })).data;
  console.log(userSuiCoins)

  console.log('Wrapping coins...');
  tx.moveCall({
    target: `${CONTRACT_ID}::fluidity_coin::wrap`,
    arguments: [
      tx.object(GLOBAL),
      tx.object(USER_VAULT),
      tx.object(COIN_RESERVE),
      tx.object(SCALLOP_VERSION),
      tx.object(SCALLOP_MARKET),
      tx.object(SUI_CLOCK_OBJECT_ID),
      tx.object(userSuiCoins[1].coinObjectId),
    ],
    typeArguments: [SUI_TYPE_ARG],
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
  console.log("Usage: node test/wrap.js <amount>");
  process.exit(1);
}

const amount = Number(process.argv[2]);

if (isNaN(amount)) {
  console.log("Please provide a valid number for the amount.");
  process.exit(1);
}

wrapCoins().catch(console.error);
