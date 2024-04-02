const { getFullnodeUrl, SuiClient } = require('@mysten/sui.js/client');
const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const {
  SUI_TYPE_ARG,
  SUI_CLOCK_OBJECT_ID,
} = require("@mysten/sui.js/utils");
const { TransactionBlock } = require('@mysten/sui.js/transactions');
const { extractTransactionStatusAndError } = require('./helpers/utils');
const {
  SCALLOP_VERSION,
  SCALLOP_MARKET,
  CONTRACT_ID,
  GLOBAL,
  USER_VAULT,
  PRIZE_POOL_VAULT,
  COIN_RESERVE,
  COIN_TYPE_STR,
} = require('./helpers/constants');
const { assert } = require('console');

require('dotenv').config();

const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });

async function unwrapCoins() {
  console.log('Unwrapping coins...');

  let privateKeyBuffer = Buffer.from(process.env.USER_PRIVATE_KEY.slice(2), 'hex');
  let signer = Ed25519Keypair.fromSecretKey(privateKeyBuffer);
  let wallet = await signer.toSuiAddress();
  console.log("Caller address", wallet)

  const tx = new TransactionBlock(); 
  tx.setGasBudget(100000000);

  const userfSuiCoins = (await suiClient.getCoins({
    owner: wallet,
    coinType: COIN_TYPE_STR,
  })).data;

  assert(userfSuiCoins.length > 0, "User has no coins to unwrap")

  tx.moveCall({
    target: `${CONTRACT_ID}::fluidity_coin::unwrap`,
    arguments: [
      tx.object(GLOBAL),
      tx.object(userfSuiCoins[0].coinObjectId), 
      tx.object(USER_VAULT),
      tx.object(PRIZE_POOL_VAULT),
      tx.object(COIN_RESERVE),
      tx.object(SCALLOP_VERSION),
      tx.object(SCALLOP_MARKET),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
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
  extractTransactionStatusAndError(executeTxn);
}

unwrapCoins().catch(console.error);