package main

import (
	"context"
	"encoding/base64"
	"fmt"

	governor "github.com/fluidity-money/fluidity-app/cmd/microservice-solana-tribeca-create-proposal/lib/govern"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvFluidityPubkey is the program id of the tribeca program
	EnvTribecaPubkey = `FLU_SOLANA_TRIBECA_PROGRAM_ID`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this must be the payout authority of the contract
	EnvPayerPrikey = `FLU_SOLANA_PAYER_PRIKEY`

	// EnvDebugFakePayouts is a boolean that if true, logs payout instead of
	// submitting them to solana
	EnvDebugFakePayouts = `FLU_DEBUG_FAKE_PAYOUTS`
)

const (
	// GovernorProgramId is the program id of the Tribeca governor program
	GovernorProgramId = `Govz1VyoyLD5BL6CSCxUJLVLsQHRwjfFj1prNsdNg5Jw`

	GovernorPubkey = `5eEt6mrrP5EpKvmrUHkuahrY255vmCd4zZPvvpv2k8BD`
	PdaPubkey      = `2aC7Mh491dHr2JhpvLkQJs97WZr74XJNS5CXoZMc1tMz`
	SystemPubkey   = `11111111111111111111111111111111`
	Instruction    = `AW/w4wPhstQx+SWlY+fUyuqbFsMRzQ8u5ttqWDY9Dyla/uM7T5wCWCSNUIxIBrvcFzd8Fc/exOjSgjqIjIFyeAQBAAIE/giFiZcAmeikbfiQMwVwYiH7NCo1wVS6nYgzMzFDFWh8f61ZBxb3U0MeJLTNQeMUqv+jA+LF3npjISpW/3F7jwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOKR+f9FMmPcIYNS3RiFa2NZ6Q8vY2BmQeIFGawkAEeWXtz5E7EJSkSRL0ucWpclg7IstzFnspoQN4/eERBohvQEDAwEAAgmvr20fDZib7f8=`
)

func main() {
	var (
		rpcUrl      = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		payerPrikey = util.GetEnvOrFatal(EnvPayerPrikey)

		//tribecaPubkey = pubkeyFromEnv(EnvTribecaPubkey)

		//debugFakePayouts = os.Getenv(EnvDebugFakePayouts) == "true"
	)

	solanaClient := solanaRpc.New(rpcUrl)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	//governorProgramId := solana.MustPublicKeyFromBase58(GovernorProgramId)
	governorPubkey := solana.MustPublicKeyFromBase58(GovernorPubkey)
	pdaPubkey := solana.MustPublicKeyFromBase58(PdaPubkey)
	systemPubkey := solana.MustPublicKeyFromBase58(SystemPubkey)

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

	createProposalInstruction := governor.NewCreateProposalInstruction(
		1,
		make([]governor.ProposalInstruction, 0),
		governorPubkey,
		pdaPubkey,
		payer.PublicKey(),
		payer.PublicKey(),
		systemPubkey,
	)

	createProposalInstructionBuild, err := createProposalInstruction.ValidateAndBuild()

	transaction, err := solana.NewTransaction(createProposalInstructionBuild, recentBlockHash)

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

	fmt.Println(base64.StdEncoding.EncodeToString(transaction.Message))

	//// if flag is set, print debug information and don't actually send transaction
	//if debugFakePayouts {
	//log.Debug(func(k *log.Log) {
	//k.Format(
	//`Drain would have been sent with account metas:
	//{SPL program: %v, fluid mint: %v, PDA: %v, obligation: %v, reserve: %v, receiving account: %v, payer: %v}
	//and instruction data %+v`,
	//)
	//})
	//return
	//}

	sig, err := solanaClient.SendTransaction(context.Background(), transaction)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to send payout transaction!"
			k.Payload = err
		})
	}

	//log.App(func(k *log.Log) {
	//	k.Format("Sent createProposal transaction with signature %v", sig)
	//})
}
