import * as Sentry from '@sentry/node';
import "@sentry/tracing";

import { Connection } from "@solana/web3.js";
import { BorshEventCoder, Wallet, web3 } from "@project-serum/anchor";
import { PublicKey, SolanaProvider } from "@saberhq/solana-contrib";
/// <reference path="./typings/base58-js" />
import { base58_to_binary } from "base58-js";

import {
  getProposalState,
  GovernorWrapper,
  LockerWrapper,
  ProposalState,
  TribecaSDK,
} from "@tribecahq/tribeca-sdk/dist/cjs";
import { GokiSDK } from "@gokiprotocol/client/dist/cjs";
import { GovernJSON } from "@tribecahq/tribeca-sdk/dist/cjs/idls/govern";

const FLU_SENTRY_URL = process.env.FLU_SENTRY_URL as string;

if (!FLU_SENTRY_URL) {
  throw new Error("FLU_SENTRY_URL not provided");
};

Sentry.init({
  dsn: FLU_SENTRY_URL,
});

const WORKER_ID = process.env.FLU_WORKER_ID as string;

if (!WORKER_ID) {
  throw new Error("WORKER_ID not provided");
};

Sentry.configureScope(scope => {
  scope.setTag('worker-id', WORKER_ID);
})

// Wrap in Sentry
try {

// EXECUTOR_SECRET_KEY is the base58 encoded key responsible for paying and signing
//  tribeca/goki transactions
const EXECUTOR_SECRET_KEY = process.env
  .FLU_SOLANA_TRIBECA_EXECUTOR_SECRET_KEY as string;

if (!EXECUTOR_SECRET_KEY) {
  throw new Error("FLU_SOLANA_TRIBECA_EXECUTOR_SECRET_KEY not provided");
}

// FLU_TRF_DATA_STORE_SECRET_KEY is the base58 encoded key responsible for paying and signing
//  trf-data-store transactions
const TRF_SECRET_KEY = process.env
  .FLU_TRF_DATA_STORE_SECRET_KEY as string;

if (!TRF_SECRET_KEY) {
  throw new Error("FLU_TRF_DATA_STORE_SECRET_KEY not provided");
}

// FLU_SOLANA_PAYER_PRIKEY is the base58 encoded key responsible for paying and signing
//  fluidity solana transactions
const FLU_SOLANA_PAYER_PRIKEY = process.env.FLU_SOLANA_PAYER_PRIKEY as string;

if (!FLU_SOLANA_PAYER_PRIKEY) {
  throw new Error("FLU_SOLANA_PAYER_PRIKEY not provided");
}

// TRIBECA_GOVERNOR_PUBKEY is the base58 public key of active governor
const FLU_TRIBECA_GOVERNOR_PUBKEY = process.env
  .FLU_TRIBECA_GOVERNOR_PUBKEY as string;

if (!FLU_TRIBECA_GOVERNOR_PUBKEY) {
  throw new Error("FLU_TRIBECA_GOVERNOR_PUBKEY not provided");
}

// TRIBECA_LOCKER_PUBKEY is the base58 public key of active locker
const FLU_TRIBECA_LOCKER_PUBKEY = process.env
  .FLU_TRIBECA_LOCKER_PUBKEY as string;

if (!FLU_TRIBECA_LOCKER_PUBKEY) {
  throw new Error("FLU_TRIBECA_LOCKER_PUBKEY not provided");
}

// TRIBECA_SMART_WALLET_PUBKEY is the base58 public key of the executor
const FLU_TRIBECA_SMART_WALLET_PUBKEY =
  process.env.FLU_TRIBECA_SMART_WALLET_PUBKEY;

if (!FLU_TRIBECA_SMART_WALLET_PUBKEY) {
  throw new Error("FLU_TRIBECA_SMART_WALLET_PUBKEY not provided");
}

// TRIBECA_EXEC_COUNCIL_PUBKEY is the base58 public key of the multi-sig
//  wallet
const FLU_TRIBECA_EXEC_COUNCIL_PUBKEY =
  process.env.FLU_TRIBECA_EXEC_COUNCIL_PUBKEY;

if (!FLU_TRIBECA_EXEC_COUNCIL_PUBKEY) {
  throw new Error("FLU_TRIBECA_EXEC_COUNCIL_PUBKEY not provided");
}

// SOLANA_RPC is the RPC URL for a Solana network
const FLU_SOLANA_RPC_URL = process.env.FLU_SOLANA_RPC_URL;

if (!FLU_SOLANA_RPC_URL) {
  throw new Error("FLU_SOLANA_RPC_URL not provided");
}

// GovernorLogs are the decoded program signatures
enum GovernorLogs {
  CreateProposal = "Program log: Instruction: CreateProposal",
  ActivateProposal = "Program log: Instruction: ActivateProposal",
  QueueProposal = "Program log: Instruction: QueueProposal",
}

// sleep returns a timeout promise
const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const payerKeypair = web3.Keypair.fromSecretKey(
  base58_to_binary(EXECUTOR_SECRET_KEY),
);

const trfDataStorePayer = web3.Keypair.fromSecretKey(
  base58_to_binary(TRF_SECRET_KEY),
);

const fluSolanaPayer = web3.Keypair.fromSecretKey(
  base58_to_binary(FLU_SOLANA_PAYER_PRIKEY),
);

const governorPubkey = new PublicKey(FLU_TRIBECA_GOVERNOR_PUBKEY);
const lockerPubkey = new PublicKey(FLU_TRIBECA_LOCKER_PUBKEY);
const smartWalletPubkey = new PublicKey(FLU_TRIBECA_SMART_WALLET_PUBKEY);
const execCouncilPubkey = new PublicKey(FLU_TRIBECA_EXEC_COUNCIL_PUBKEY);

const connection = new Connection(FLU_SOLANA_RPC_URL, "processed");

const wallet = new Wallet(payerKeypair);

const provider = SolanaProvider.init({
  connection,
  wallet,
});

(async () => {
  const tribecaSdk = TribecaSDK.load({ provider });
  const gokiSdk = GokiSDK.load({ provider });

  const governor = new GovernorWrapper(tribecaSdk, governorPubkey);
  const locker = await LockerWrapper.load(
    tribecaSdk,
    lockerPubkey,
    governorPubkey,
  );

  const smartWallet = await gokiSdk.loadSmartWallet(smartWalletPubkey);
  const execCouncil = await gokiSdk.loadSmartWallet(execCouncilPubkey);

  // governorEventDecoder parses emitted governor events
  const governorEventDecoder = new BorshEventCoder(GovernJSON);

  const governorData = await governor.data();

  // votingDelay is the period (seconds) to wait to activate a drafted proposal
  // votingPeriod is the period (seconds) to wait for the voting period to end
  // timelockDelaySeconds is the period to wait to execute an approved proposal
  const { votingDelay, votingPeriod, timelockDelaySeconds } =
    governorData.params;

  const payerExecCouncilIndex = execCouncil.data!.owners.findIndex(
    (key: PublicKey) => key.toString() === payerKeypair.publicKey.toString(),
  );

  if (payerExecCouncilIndex === -1) {
    throw new Error(
      "Payer is not on ExecCouncil - Cannot execute transactions",
    );
  }

  // execCouncilSigner is the PDA from a signer on the executive council
  const [execCouncilSigner] = await execCouncil.findOwnerInvokerAddress(
    payerExecCouncilIndex,
  );

  connection.onLogs(
    governorPubkey,
    async ({ signature, err, logs }) => {
      console.log("signature:", signature);
      console.log("error:", err);
      console.log("logs:", logs);
      console.log();

      if (logs.length < 2) {
        // TODO: Add logging here?
        return;
      }

      // instSignature is the logged instruction signature
      const instSignature = logs[1];

      switch (instSignature) {
        case GovernorLogs.CreateProposal: {
          console.log("Found CreateProposal event!");

          if (logs.length < 7) {
            throw new Error(`Bad createProposal log: ${logs}`);
          }

          const votingDelayPromise = sleep(
            votingDelay.toNumber() * 1000 + 5000,
          );

          const event = logs[4].split(": ")[1];

          console.log(event);

          const createProposalEvent = governorEventDecoder.decode(
            event,
          );

          if (!createProposalEvent) {
            throw new Error(`Could not decode createProposal event ${event}`);
          }

          const { proposal } = createProposalEvent.data as {
            proposal: PublicKey;
          };

          // wait for delay after proposal creation to activate
          await votingDelayPromise;

          const activateProposal = await locker.activateProposal({
            proposal: new PublicKey(proposal),
            authority: payerKeypair.publicKey,
          });

          activateProposal.addSigners(payerKeypair);

          activateProposal.send();

          return;
        }

        case GovernorLogs.ActivateProposal: {
          console.log("Found ActivateProposal event!");

          if (logs.length < 9) {
            throw new Error(`Bad activateProposal log: ${logs}`);
          }

          const votingPeriodPromise = sleep(
            (votingPeriod.toNumber() * 1000) + 1000,
          );

          const event = logs[4].split(": ")[1];

          const activateProposalEvent = governorEventDecoder.decode(
            event,
          );

          if (!activateProposalEvent) {
            throw new Error(`Could not decode activateProposal event ${event}`);
          }

          const { proposal } = activateProposalEvent.data as {
            proposal: PublicKey;
          };

          // Wait for voting period
          await votingPeriodPromise;

          const proposalData = await governor.fetchProposalByKey(
            new PublicKey(proposal),
          );

          if (getProposalState({ proposalData }) === ProposalState.Succeeded) {
            const queueProposalTx = await governor.queueProposal({
              index: proposalData.index,
            });

            queueProposalTx.addSigners(payerKeypair);

            queueProposalTx.send();
          }

          return;
        }

        case GovernorLogs.QueueProposal: {
          console.log("Found queueProposal event!");

          if (logs.length < 12) {
            throw new Error(`Bad queueProposal logs: ${logs}`);
          }

          const event = logs[9].split(": ")[1];

          const queueProposalEvent = governorEventDecoder.decode(
            event,
          );

          if (!queueProposalEvent) {
            throw new Error(`Could not decode queueProposal event: ${event}`);
          }

          const { transaction } = queueProposalEvent.data as {
            transaction: PublicKey;
          };

          // approveTx is the transaction run by the smart wallet
          const approveTx = smartWallet.approveTransaction(
            new PublicKey(transaction),
            execCouncilSigner,
          );

          await sleep(5000);

          // invokeApproveTx is the transaction to run approveTx via a PDA
          // from the executive council
          const invokeApproveTx = await execCouncil.ownerInvokeInstructionV2({
            instruction: approveTx.instructions[0],
            index: payerExecCouncilIndex,
          });

          invokeApproveTx.addSigners(payerKeypair);

          await invokeApproveTx.send();

          console.log("Approved transaction!");

          const timelockDelayPromise = sleep(
            timelockDelaySeconds.toNumber() * 1000 + 5000,
          );

          await timelockDelayPromise;

          // Execute transaction
          const executeTx = await smartWallet.executeTransaction({
            transactionKey: new PublicKey(transaction),
            owner: execCouncilSigner,
          });

          const invokeExecuteTx = await execCouncil.ownerInvokeInstructionV2({
            instruction: executeTx.instructions[0],
            index: payerExecCouncilIndex,
          });

          invokeExecuteTx.addSigners(payerKeypair);
          invokeExecuteTx.addSigners(trfDataStorePayer);
          invokeExecuteTx.addSigners(fluSolanaPayer);

          await invokeExecuteTx.send();

          console.log("Executed Transaction! ");

          return;
        }

        default:
          return;
      }
    },
    "confirmed",
  );
})();

} catch (e) {
  Sentry.captureException(e)
}
