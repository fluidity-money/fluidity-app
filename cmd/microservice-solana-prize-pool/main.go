package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	prize_pool "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	solLib "github.com/fluidity-money/microservice-solana-prize-pool/lib/solana"

	"github.com/fluidity-money/fluidity-app/lib/util"
	solana "github.com/gagliardetto/solana-go"
)

const (
	// EnvSolanaRpcUrl is the RPC url of the solana node to connect to
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvUpdateInterval is the interval between each prize pool update
	EnvUpdateInterval = `FLU_SOLANA_PRIZE_POOL_UPDATE_TIME`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvFluidityPubkey = `FLU_SOLANA_PROGRAM_ID`

	// EnvFluidityMintPubkey is the public key of the fluid token mint
	EnvFluidityMintPubkey = `FLU_SOLANA_FLUID_MINT_PUBKEY`

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

func updatePrizePool(solanaRpcUrl string, fluidityPubkey, fluidMintPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payer *solana.Wallet) {
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

	mintSupply := solLib.GetMintSupply(
		solanaRpcUrl,
		fluidMintPubkey,
	)

	if mintSupply > tvl {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Got a mint supply that was higher than our tvl! %d > %d",
				mintSupply,
				tvl,
			)
		})
	}

	prizePool := float64(tvl - mintSupply) / 1e6

	log.Debug(func(k *log.Log) {
		k.Format("Got TVL %d, supply %d, prize pool %d", tvl, mintSupply, prizePool)
	})

	prizePoolUpdate := prize_pool.PrizePool{
		Network:         string(network.NetworkSolana),
		ContractAddress: fluidityPubkey.String(),
		Amount:          prizePool,
		LastUpdated:     time.Now(),
	}

	queue.SendMessage(prize_pool.TopicPrizePoolSolana, prizePoolUpdate)
}

func main() {
	var (
		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		fluidMintPubkey   = pubkeyFromEnv(EnvFluidityMintPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)
		payerPrikey       = util.GetEnvOrFatal(EnvPayerPrikey)
		solanaRpcUrl      = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		updateInterval    = util.GetEnvOrFatal(EnvUpdateInterval)
	)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer prikey!"
			k.Payload = err
		})
	}

	// solana has a really low blocktime, so update this on an arbitrary delay
	interval, err := time.ParseDuration(updateInterval)

	if err != nil {
	    log.Fatal(func (k *log.Log) {
	        k.Message = "Failed to read update interval!"
	        k.Payload = err
	    })
	}

	timer := time.NewTicker(interval)

	for {
		select {
		case <- timer.C:
			updatePrizePool(
				solanaRpcUrl,
				fluidityPubkey,
				fluidMintPubkey,
				tvlDataPubkey,
				solendPubkey,
				obligationPubkey,
				reservePubkey,
				pythPubkey,
				switchboardPubkey,
				payer,
			)
		}
	}
}
