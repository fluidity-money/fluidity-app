package main

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/util"

	prize_pool "github.com/fluidity-money/fluidity-app/common/solana/prize-pool"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

const (
	// RedisTvlKey to store the tvl calculation
	RedisTvlKey = `worker.tvl`

	// RedisTvlDuration to store the Pyth TVL calculation
	RedisTvlDuration = time.Minute * 30
)

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

	// EnvTopicWrappedActionsQueue to use when receiving TVL, mint
	// supply, and user actions from retriever
	EnvTopicWrappedActionsQueue = `FLU_SOLANA_WRAPPED_ACTIONS_QUEUE_NAME`
)

func main() {

	var (
		rpcUrl                   = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		payerPrikey              = util.GetEnvOrFatal(EnvPayerPrikey)
		topicWrappedActionsQueue = util.GetEnvOrFatal(EnvTopicWrappedActionsQueue)

		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		fluidMintPubkey   = pubkeyFromEnv(EnvFluidityMintPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		obligationPubkey  = pubkeyFromEnv(EnvObligationPubkey)
		reservePubkey     = pubkeyFromEnv(EnvReservePubkey)
		pythPubkey        = pubkeyFromEnv(EnvPythPubkey)
		switchboardPubkey = pubkeyFromEnv(EnvSwitchboardPubkey)
	)

	solanaClient := solanaRpc.New(rpcUrl)

	payer, err := solana.WalletFromPrivateKeyBase58(payerPrikey)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to decode payer private key!"
			k.Payload = err
		})
	}

	worker.GetSolanaBufferedTransfers(func(transfers worker.SolanaBufferedTransfers) {

		// get the entire amount of fUSDC in circulation (the amount of USDC wrapped)

		mintSupply, err := prize_pool.GetMintSupply(solanaClient, fluidMintPubkey)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to get the mint supply! %v",
					err,
				)
			})
		}

		// we try to get the tvl from pyth and if we fail read
		// from a Redis cache!

		// get the value of all fluidity obligations

		tvl, err := prize_pool.GetTvl(
			solanaClient,
			fluidityPubkey,
			tvlDataPubkey,
			solendPubkey,
			obligationPubkey,
			reservePubkey,
			pythPubkey,
			switchboardPubkey,
			payer,
		)

		if err != nil {
			tvl, _, err = redisGetTvl()

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to get the Redis TVL key!"
					k.Payload = err
				})
			}

			log.App(func(k *log.Log) {
				k.Format(
					"USING THE CACHED AMOUNT %v - Failed to get the TVL with pubkey %#v, solend pubkey %#v, obligation pubkey %#v! %v",
					tvl,
					tvlDataPubkey,
					solendPubkey,
					obligationPubkey,
					err,
				)
			})
		}

		// if we didn't fail to get the tvl from pyth and redis,
		// then we should set the tvl retrieved to redis!

		state.Set(RedisTvlKey, tvl)

		// check initial supply is less than TVL so there is
		// an available prize pool

		if mintSupply > tvl {

			state.Del(RedisTvlKey)

			log.Fatal(func(k *log.Log) {
				k.Format(
					"The mint supply %v > the TVL %v! Prize pool not available - deleted the cache!",
					mintSupply,
					tvl,
				)
			})
		}

		if !tvlBuffered {
			state.SetNxTimed(RedisTvlKey, tvl, RedisTvlDuration)
		}

		payableBufferedTransfers := worker.SolanaWork{
			BufferedTransfers: transfers,
			Tvl:               tvl,
			MintSupply:        mintSupply,
		}

		queue.SendMessage(topicWrappedActionsQueue, payableBufferedTransfers)

	})
}
