import type {Idl, Program} from "@project-serum/anchor";

import { newProgramMap } from "@saberhq/anchor-contrib";
import {Connection} from "@solana/web3.js";
import {Wallet, web3} from "@project-serum/anchor";
import {PublicKey, SolanaProvider, SolanaAugmentedProvider} from "@saberhq/solana-contrib";
import * as amqp from "amqplib";
import * as b58 from 'base58-js';
import {Client} from "pg";

import UtilityGaugeIdl_ from './idls/utility_gauge.json';

const SOLANA_RPC_URL = process.env.FLU_SOLANA_RPC_URL as string;

if (!SOLANA_RPC_URL) {
  throw new Error("FLU_SOLANA_RPC_URL not provided");
}

const UTILITY_GAUGE_PROGRAM_ID = process.env.FLU_UTILITY_GAUGE_PROGRAM_ID as string;

if (!UTILITY_GAUGE_PROGRAM_ID) {
  throw new Error("FLU_UTILITY_GAUGE_PROGRAM_ID not provided");
}

const GAUGEMEISTER_PUBKEY = process.env.FLU_SOLANA_GAUGEMEISTER_PUBKEY as string;

if (!GAUGEMEISTER_PUBKEY) {
  throw new Error("FLU_SOLANA_GAUGEMEISTER_PUBKEY not provided");
}

const UTILITY_GAUGE_SECRET_KEY = process.env.FLU_SOLANA_UTILITY_GAUGE_SECRET_KEY as string;

if (!UTILITY_GAUGE_SECRET_KEY) {
  throw new Error("FLU_SOLANA_UTILITY_GAUGE_SECRET_KEY not provided");
}

const FLU_RABBITMQ_URL = process.env.FLU_RABBITMQ_URL as string;

if (!FLU_RABBITMQ_URL) {
  throw new Error("FLU_RABBITMQ_URL not provided");
}

const FLU_POSTGRES_URI = process.env.FLU_POSTGRES_URI as string;

if (!FLU_POSTGRES_URI) {
  throw new Error("FLU_POSTGRES_URI not provided");
}

const TopicUtilityGauge = "utility_gauge.utility_gauges";

const ExchangeName = "fluidity";
const ExchangeType = "topic";
    
const TableWhitelistedGauges = "whitelisted_gauges";
 
const gaugemeisterPubkey = new PublicKey(GAUGEMEISTER_PUBKEY);

const utilityGaugePubkey = new PublicKey(UTILITY_GAUGE_PROGRAM_ID);

const payerKeypair = web3.Keypair.fromSecretKey(
  b58.base58_to_binary(UTILITY_GAUGE_SECRET_KEY)
);

const connection = new Connection(SOLANA_RPC_URL, "processed");

const wallet = new Wallet(payerKeypair);

// Load the utility gauge program
const provider = SolanaProvider.init({
  connection,
  wallet,
});

const augmentedProvider = new SolanaAugmentedProvider(provider);

const UtilityGaugeIdl = UtilityGaugeIdl_ as Idl

type UtilityGaugeProgram = Program<typeof UtilityGaugeIdl>;

interface Programs {
  UtilityGauge: UtilityGaugeProgram;
}

const UTILITY_GAUGE_ADDRESSES = {
  UtilityGauge: utilityGaugePubkey,
};

/**
 * Program IDLs.
*/
const UTILITY_GAUGE_IDLS = {
  UtilityGauge: UtilityGaugeIdl,
};


const programs = newProgramMap<Programs>(
  provider,
  UTILITY_GAUGE_IDLS,
  UTILITY_GAUGE_ADDRESSES
);

const utilityGauge = programs.UtilityGauge;

const pgClient = new Client(FLU_POSTGRES_URI);

const triggerNextEpoch = async(amqpChannel: amqp.Channel, timeoutMs: number) => {
  setTimeout(async() => {
    // trigger next epoch
    const triggerNextEpochInst = utilityGauge.instruction.triggerNextEpoch({
      accounts: {
        gaugemeister: gaugemeisterPubkey,
      }
    });
  
    const triggerNextEpochTx = augmentedProvider.newTX([triggerNextEpochInst]);
  
    triggerNextEpochTx.addSigners(payerKeypair);
  
    await triggerNextEpochTx.send();

    const gaugemeister = await utilityGauge.account.gaugemeister.fetchNullable(gaugemeisterPubkey);

    pgClient.connect();

    const whitelistedGaugesRes = await pgClient.query(
      `SELECT
        gauge
      FROM ${TableWhitelistedGauges}`);

    pgClient.end();
    
    const whitelistedGauges = whitelistedGaugesRes.rows;
    
    if (gaugemeister === null) {
      throw new Error("could not fetch gaugemeister at address " + gaugemeisterPubkey.toString());
    }
  
    const {epochDurationSeconds, currentRewardsEpoch} = gaugemeister;
  
    const updatedGauges = {
      gaugemeister: gaugemeisterPubkey.toString(),
      epoch: currentRewardsEpoch,
      gauges: whitelistedGauges,
    }

    const updatedGaugesBuffer = Buffer.from(JSON.stringify(updatedGauges));

    amqpChannel.sendToQueue(TopicUtilityGauge, updatedGaugesBuffer);
    
    timeoutMs = epochDurationSeconds * 1000;

    await triggerNextEpoch(amqpChannel, timeoutMs);

  }, timeoutMs);
}

(async() => {
  // Load rabbitmq
  const amqpConnection = await amqp.connect(FLU_RABBITMQ_URL);

  const amqpChannel = await amqpConnection.createChannel();

  amqpChannel.assertExchange(ExchangeName, ExchangeType, {
    durable: true,
    autoDelete: false,
    internal: false,
  });

  const gaugemeister = await utilityGauge.account.gaugemeister.fetchNullable(gaugemeisterPubkey);
  
  if (gaugemeister === null) {
    throw new Error("could not fetch gaugemeister at address: " + gaugemeisterPubkey.toString());
  }
  
  const { nextEpochStartsAt } = gaugemeister;
  const nextEpochStartsAtMs = nextEpochStartsAt.toNumber() * 1000;
  
  const currentUnixMs = (new Date()).valueOf()
  
  await triggerNextEpoch(amqpChannel, nextEpochStartsAtMs - currentUnixMs);

})();


