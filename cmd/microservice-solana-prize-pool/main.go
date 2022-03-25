package main

import (
	"math/big"
	"time"

	solLib "github.com/fluidity-money/fluidity-app/cmd/microservice-solana-prize-pool/lib/solana"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	prize_pool "github.com/fluidity-money/fluidity-app/lib/queues/prize-pool"
	"github.com/fluidity-money/fluidity-app/lib/types/network"

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

	// EnvTvlDataPubkey is the public key of an initialized account for storing TVL data
	EnvTvlDataPubkey = `FLU_SOLANA_TVL_DATA_PUBKEY`

	// EnvSolendPubkey is the program id of the solend program
	EnvSolendPubkey = `FLU_SOLANA_SOLEND_PROGRAM_ID`

	// EnvPayerPrikey is a private key of an account that holds solana funds
	// this program doesn't alter onchain state, and thus won't actually spend anything
	EnvPayerPrikey = `FLU_SOLANA_TVL_PAYER_PRIKEY`

	// EnvTokensList to use to identify Fluidity f token addresses, their name,
	// their decimal places, and their associated Solend keys
	EnvTokensList = `FLU_SOLANA_TOKENS_LIST`

	// WorkerPoolAmount to have running as goroutines to send work to
	WorkerPoolAmount = 30
)

// pubkeyFromEnv gets and decodes a solana public key from an environment variable,
// panicking if the env doesn't exist or isn't a valid key
func pubkeyFromEnv(env string) solana.PublicKey {
	pubkeyString := util.GetEnvOrFatal(env)

	pubkey := solana.MustPublicKeyFromBase58(pubkeyString)

	return pubkey
}

func getPrizePool(solanaRpcUrl string, fluidityPubkey, fluidMintPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payer *solana.Wallet) *big.Rat {
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

	// TODO does this need to be price lookup-ed a la uniswap anchored view
	prizePool := int64(tvl - mintSupply)

	log.Debug(func(k *log.Log) {
		k.Format("Got TVL %d, supply %d, prize pool %d, for pubkey %v", tvl, mintSupply, prizePool, fluidMintPubkey.String())
	})

	// return the whole amount in the unit of that token
	return big.NewRat(prizePool, 1) 
}

func main() {
	var (
		fluidityPubkey    = pubkeyFromEnv(EnvFluidityPubkey)
		tvlDataPubkey     = pubkeyFromEnv(EnvTvlDataPubkey)
		solendPubkey      = pubkeyFromEnv(EnvSolendPubkey)
		payerPrikey       = util.GetEnvOrFatal(EnvPayerPrikey)
		solanaRpcUrl      = util.GetEnvOrFatal(EnvSolanaRpcUrl)
		updateInterval    = util.GetEnvOrFatal(EnvUpdateInterval)
		tokensList_       = util.GetEnvOrFatal(EnvTokensList)
	)

	// tokensList will Fatal if bad input
	tokenDetails := getTokensList(tokensList_)

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

	var (
		workChan = make(chan TokenDetails, 0)
		doneChan = make(chan TokenDetails, 0)
	)

	for i := 0; i < WorkerPoolAmount; i++ {
		go func() {
			for work := range workChan {

				var (
					fluidMintPubkey   = work.fluidMintPubkey
					obligationPubkey  = work.obligationPubkey
					reservePubkey     = work.reservePubkey
					pythPubkey        = work.pythPubkey
					switchboardPubkey = work.switchboardPubkey
					decimalsRat       = work.tokenDecimals
				)

				prizePool := getPrizePool(
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

				// adjust for decimals
				prizePoolAdjusted := prizePool.Quo(prizePool, decimalsRat)
				prizePoolFloat, _ := prizePoolAdjusted.Float64()

				tokenDetailsComplete := TokenDetails{
					fluidMintPubkey:   fluidMintPubkey, 
					obligationPubkey:  obligationPubkey,
					reservePubkey:     reservePubkey,	
					pythPubkey:        pythPubkey,			
					switchboardPubkey: switchboardPubkey,			
					tokenDecimals:     decimalsRat,
					amount:            prizePoolFloat,
				}

				doneChan <- tokenDetailsComplete
			}
		}()
	}	

	timer := time.NewTicker(interval)

	for {
		select {
		case <- timer.C:
			var amount float64
			// fetch amount for each token
			for _, tokenDetail := range tokenDetails {
				workChan <- tokenDetail
			}

			// aggregate results
			for range tokenDetails {
				tokenDetails := <- doneChan
				amount += tokenDetails.amount
			}

			prizePool := prize_pool.PrizePool{
				Network:     string(network.NetworkSolana),
				Amount:      amount,
				LastUpdated: time.Now(),
			}
			
			log.Debug(func(k *log.Log) {
				k.Format("Publishing aggregated prize pool: %v", amount)
			})

			queue.SendMessage(
				prize_pool.TopicPrizePoolSolana,
				prizePool,
			)
		}
	}
}
