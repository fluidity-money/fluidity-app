package main

import (
	solLib "github.com/fluidity-money/fluidity-app/cmd/connector-solana-tvl-amqp/lib/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	idoQueue "github.com/fluidity-money/fluidity-app/lib/queues/ido"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
	solana "github.com/gagliardetto/solana-go"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

	// EnvTvlDataPubkey is the public key of an initialized account for storing TVL data
	EnvTvlDataPubkey = `FLU_SOLANA_TVL_DATA_PUBKEY`

	// EnvSolendPubkey is the program id of the solend program
	EnvSolendPubkey = `FLU_SOLANA_SOLEND_PROGRAM_ID`

	// EnvObligationPubkey is the public key of the solend pool obligation account
	EnvObligationPubkey = `FLU_SOLANA_OBLIGATION_PUBKEY`

	// EnvReservePubkey is the public key of the solend pool reserve account
	EnvReservePubkey = `FLU_SOLANA_RESERVE_PUBKEY`

	// EnvPythPubkey is the public key of the solend pool pyth account
	EnvPythPubkey = `FLU_SOLANA_PYTH_PUBKEY`

	// EnvSwitchboardPubkey is the public key of the solend pool switchboard account
	EnvSwitchboardPubkey = `FLU_SOLANA_SWITCHBOARD_PUBKEY`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this program doesn't alter onchain state, and thus won't actually spend anything
	EnvPayerPrikey = `FLU_SOLANA_TVL_PAYER_PRIKEY`
)

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey := solana.MustPublicKeyFromBase58(pubkeyString)

	return pubkey
}

func main() {
	var (
		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)
		payerPrikey       = util.GetEnvOrFatal(EnvPayerPrikey)
		solanaRpcUrl      = util.GetEnvOrFatal(EnvSolanaRpcUrl)
	)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer prikey!"
			k.Payload = err
		})
	}

	tvl := solLib.GetTvl(
		solanaRpcUrl,
		fluidityPubkey,
		tvlDataPubkey,
		solendPubkey,
		obligationPubkey,
		reservePubkey,
		pythPubkey,
		switchboardPubkey,
		payer,
	)

	log.Debug(func(k *log.Log) {
		k.Format("Got TVL from chain: %d", tvl)
	})

	tvlContainer := idoQueue.TvlUpdateContainer{
		Tvl:             tvl,
		Network:         network.NetworkSolana,
		ContractAddress: fluidityPubkey.String(),
	}

	queue.SendMessage(idoQueue.TopicTvlUpdates, tvlContainer)
}
