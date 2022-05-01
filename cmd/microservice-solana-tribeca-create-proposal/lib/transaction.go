package main

import (
	"context"
	b64 "encoding/base64"
	"fmt"
	"os"

	"github.com/fluidity-money/fluidity-app/common/solana/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"

	"github.com/near/borsh-go"
)

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey := solana.MustPublicKeyFromBase58(pubkeyString)

	return pubkey
}

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

	// EnvFluidityMintPubkey is the public key of the fluid token mint
	EnvFluidityMintPubkey = `FLU_SOLANA_FLUID_MINT_PUBKEY`

	// EnvTvlDataPubkey is the public key of an initialized account for storing
	// TVL data
	EnvTvlDataPubkey = `FLU_SOLANA_TVL_DATA_PUBKEY`

	// EnvSolendPubkey is the program id of the solend program
	EnvSolendPubkey = `FLU_SOLANA_SOLEND_PROGRAM_ID`

	// EnvObligationPubkey is the public key of the solend pool obligation
	// account
	EnvObligationPubkey = `FLU_SOLANA_OBLIGATION_PUBKEY`

	// EnvReservePubkey is the public key of the solend pool reserve account
	EnvReservePubkey = `FLU_SOLANA_RESERVE_PUBKEY`

	// EnvPythPubkey is the public key of the solend pool pyth account
	EnvPythPubkey = `FLU_SOLANA_PYTH_PUBKEY`

	// EnvSwitchboardPubkey is the public key of the solend pool switchboard
	// account
	EnvSwitchboardPubkey = `FLU_SOLANA_SWITCHBOARD_PUBKEY`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this must be the payout authority of the contract
	EnvPayerPrikey = `FLU_SOLANA_PAYER_PRIKEY`

	// EnvTopicWinnerQueue to use when transmitting to a client the topic of
	// a winner
	EnvTopicWinnerQueue = `FLU_SOLANA_WINNER_QUEUE_NAME`

	// EnvDebugFakePayouts is a boolean that if true, logs payout instead of
	// submitting them to solana
	EnvDebugFakePayouts = `FLU_DEBUG_FAKE_PAYOUTS`

	// EnvSolPythPubkey is the public key of the pyth price account for SOL
	EnvSolPythPubkey = `FLU_SOLANA_SOL_PYTH_PUBKEY`

	// EnvTokenName is the same of the token being wrapped
	EnvTokenName = `FLU_SOLANA_TOKEN_NAME`

	// EnvReceiverPubkey is the address of the receiving account
	EnvReceiverPubkey = `FLU_SOLANA_RECEIVER_PUBKEY`
)

const (
	// SplProgramId is the program id of the SPL token program
	SplProgramId = `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`
)

func main() {
	var (
		rpcUrl      = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		payerPrikey = util.GetEnvOrFatal(EnvPayerPrikey)

		fluidityPubkey   = pubkeyFromEnv(EnvFluidityPubkey)
		fluidMintPubkey  = pubkeyFromEnv(EnvFluidityMintPubkey)
		obligationPubkey = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey    = pubkeyFromEnv(EnvReservePubkey)
		receiverPubkey   = pubkeyFromEnv(EnvReceiverPubkey)

		tokenName = util.GetEnvOrFatal(EnvTokenName)

		debugFakePayouts = os.Getenv(EnvDebugFakePayouts) == "true"
	)

	// Creating Drain Payout instruction

	var (
		obligationString = fmt.Sprintf("FLU:%s_OBLIGATION", tokenName)
		obligationBytes_ = []byte(obligationString)
		obligationBytes  = [][]byte{obligationBytes_}
	)

	pdaPubkey, bumpSeed, err := solana.FindProgramAddress(
		obligationBytes,
		fluidityPubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to derive the PDA account and bump seed! %v",
				err,
			)
		})
	}

	solanaClient := solanaRpc.New(rpcUrl)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	splPubkey := solana.MustPublicKeyFromBase58(SplProgramId)

	recentBlockHashResult, err := solanaClient.GetRecentBlockhash(
		context.Background(),
		solanaRpc.CommitmentFinalized,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to get a recent Solana blockhash!"
			k.Payload = err
		})
	}

	recentBlockHashResultValue := recentBlockHashResult.Value

	if recentBlockHashResultValue == nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Block hash requested from Solana was nil!"
		})
	}

	recentBlockHash := recentBlockHashResultValue.Blockhash

	var (

		// solanaAccountMetaSpl is used to know where to send transactions
		solanaAccountMetaSpl = solana.NewAccountMeta(splPubkey, false, false)

		// solanaAccountFluidMint is needed to be writable and used as a mint,
		// tracking the amounts of Fluid tokens that the account has. is set to true
		// to indicate mutability
		solanaAccountFluidMint = solana.NewAccountMeta(fluidMintPubkey, true, false)

		// solanaAccountPDA is used as an authority to sign off on minting
		// by the payout function
		solanaAccountPDA = solana.NewAccountMeta(pdaPubkey, false, false)

		// solanaAccountObligation to use to track the amount of Solend
		// obligations that Fluidity owns to pass the account to do a calculation for
		// the prize pool
		solanaAccountObligation = solana.NewAccountMeta(
			obligationPubkey,
			false,
			false,
		)

		// solanaAccountReserve to use to track the exchange rate of obligation
		// collateral
		solanaAccountReserve = solana.NewAccountMeta(
			reservePubkey,
			false,
			false,
		)

		// accounts used to indicate the payout recipients from the reward function.
		// both accounts are mutable to support sending to the token accounts

		solanaAccountReceiver = solana.NewAccountMeta(receiverPubkey, true, false)

		// solanaAccountPayer, with true set to sign amounts paid out to the
		// recipients, strictly the fluidity authority
		solanaAccountPayer = solana.NewAccountMeta(
			payer.PublicKey(),
			true,
			true,
		)
	)

	accountMetas := solana.AccountMetaSlice{
		solanaAccountMetaSpl,
		solanaAccountFluidMint,
		solanaAccountPDA,
		solanaAccountObligation,
		solanaAccountReserve,
		solanaAccountReceiver,
		solanaAccountPayer,
	}

	drainInstruction := fluidity.InstructionDrain{
		fluidity.VariantDrain,
		tokenName,
		bumpSeed,
	}

	// if flag is set, print debug information and don't actually send payout
	if debugFakePayouts {
		log.Debug(func(k *log.Log) {
			k.Format(
				`Drain would have been sent with account metas:
{SPL program: %v, fluid mint: %v, PDA: %v, obligation: %v, reserve: %v, receiving account: %v, payer: %v}
and instruction data %+v`,
				splPubkey,
				fluidMintPubkey,
				pdaPubkey,
				obligationPubkey,
				reservePubkey,
				receiverPubkey,
				payer.PublicKey(),
				drainInstruction,
			)
		})
		return
	}

	drainInstructionBytes, err := borsh.Serialize(drainInstruction)

	drainInstructionB64 := b64.StdEncoding.EncodeToString(drainInstructionBytes)

	fmt.Println(drainInstructionB64)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to serialize drain instruction data!"
			k.Payload = err
		})
	}

	instruction := solana.NewInstruction(
		fluidityPubkey,
		accountMetas,
		drainInstructionBytes,
	)

	instructions := []solana.Instruction{instruction}

	transaction, err := solana.NewTransaction(instructions, recentBlockHash)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to construct payout transaction!"
			k.Payload = err
		})
	}

	_, err = transaction.Sign(func(key solana.PublicKey) *solana.PrivateKey {

		if payer.PublicKey().Equals(key) {
			return &payer.PrivateKey
		}

		return nil
	})

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to sign transaction!"
			k.Payload = err
		})
	}

	drainTransactionB64, err := transaction.ToBase64()

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to serialize drain transaction!"
			k.Payload = err
		})
	}

	fmt.Println(drainTransactionB64)

	sig, err := solanaClient.SendTransaction(context.Background(), transaction)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to send payout transaction!"
			k.Payload = err
		})
	}

	log.App(func(k *log.Log) {
		k.Format("Sent payout transaction with signature %v", sig)
	})
}
