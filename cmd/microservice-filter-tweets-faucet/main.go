package main

import (
	"math/big"
	"strings"
	"time"

	faucetDatabase "github.com/fluidity-money/fluidity-app/lib/databases/postgres/faucet"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/log/slack"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/faucet"
	twitterQueue "github.com/fluidity-money/fluidity-app/lib/queues/twitter"
	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvFilteredHashtags to consume with this service
	EnvFilteredHashtags = "FLU_TWITTER_HASHTAGS"

	// EnvTwitterConsumerKey to use when sending reply tweets to faucet
	// requests
	EnvTwitterConsumerKey = "FLU_TWITTER_CONSUMER_KEY"

	// EnvTwitterConsumerSecret to use when sending reply tweets to faucet
	// requests
	EnvTwitterConsumerSecret = "FLU_TWITTER_CONSUMER_SECRET"

	// StateKeyExpiry to prevent people from abusing timing attacks to exploit
	// the faucet
	StateKeyExpiry = 30 * time.Second

	// EthereumNullAddress to filter for to prevent it from blocking the thing
	// for Ethereum
	EthereumNullAddress = "0x0000000000000000000000000000000000000000"

	// SolanaNullAddress to filter for to prevent it from causing a crash
	// on transferring
	SolanaNullAddress = "11111111111111111111111111111111"
)

// FaucetTimeBetweenUse to control for people using the faucet at intervals
var (
	FaucetTimeBetweenUse = floatAsInt64((24 * time.Hour).Seconds())

	// DefaultAmountEthereum to send to Ethereum users of the faucet
	DefaultAmountBigEthereum = big.NewInt(10_000_000)

	// DefaultAmountBigSolana to use to send to Solana to pay 1000 USDC
	DefaultAmountBigSolana = big.NewInt(1_000_000_000)

	// DefaultAmountEthereum to use to track uses of the faucet
	DefaultAmountEthereum = misc.NewBigInt(*DefaultAmountBigEthereum)

	// DefaultAmountSolana to give away to users of the faucet
	DefaultAmountSolana = misc.NewBigInt(*DefaultAmountBigSolana)
)

func main() {

	filteredHashtags_ := util.GetEnvOrFatal(EnvFilteredHashtags)

	filteredHashtags := strings.Split(filteredHashtags_, ",")

	log.Debug(func(k *log.Log) {
		k.Format("Filtering for the hashtags %#v!", filteredHashtags)
	})

	twitterQueue.Tweets(func(tweet twitterQueue.Tweet) {

		twitterUsername := tweet.TweeterUsername

		if !tweetContainsHashtag(tweet, filteredHashtags...) {
			return
		}

		uniqueAddress := tweetContainsUniqueAddress(tweet)

		if uniqueAddress == "" {
			return
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"Tweet at link %#v contains a unique address of %#v!",
				tweet.Url,
				uniqueAddress,
			)
		})

		networkChosen_ := tweetContainsNetworkHashtag(tweet)

		switch networkChosen_ {
		case string(network.NetworkEthereum):
		case string(network.NetworkSolana):

		default:
			log.App(func(k *log.Log) {
				k.Message = "Network chosen not (ethereum|solana)! Was"
				k.Payload = networkChosen_
			})

			return
		}

		networkChosen := network.BlockchainNetwork(networkChosen_)

		var amountSent misc.BigInt

		switch networkChosen {

		case network.NetworkEthereum:
			amountSent = DefaultAmountEthereum

		case network.NetworkSolana:
			amountSent = DefaultAmountSolana

		default:
			panic("Network wasn't expected!" + networkChosen_)
		}

		log.Debug(func(k *log.Log) {
			k.Format(
				"Looking up unique address %v and network %v!",
				uniqueAddress,
				networkChosen,
			)
		})

		lastUsed, address := faucetDatabase.GetFaucetLastUsedAndAddress(
			uniqueAddress,
			networkChosen,
		)

		log.Debug(func(k *log.Log) {
			k.Format(
				"lastUsed: %#v address: %#v for UniqueAddress: %#v ",
				lastUsed,
				address,
				uniqueAddress,
			)
		})

		if address == EthereumNullAddress {

			log.App(func(k *log.Log) {
				k.Format(
					"Unique address %#v, tweet %#v tweeted the Ethereum null address at us!",
					tweet,
					uniqueAddress,
				)
			})

			return
		}

		if address == SolanaNullAddress {

			log.App(func(k *log.Log) {
				k.Format(
					"Unique address %#v, tweet %#v tweeted the Solana null address at us!",
					tweet,
					uniqueAddress,
				)
			})

			return
		}

		var lastUsedSeconds int64 = 0

		if lastUsed != nil {
			lastUsedSeconds = lastUsed.Unix()
		}

		currentTime := time.Now()

		var currentTime_ int64 = currentTime.Unix()

		if currentTime_-lastUsedSeconds < FaucetTimeBetweenUse {

			log.App(func(k *log.Log) {
				k.Format(
					"Unique address %#v tweeted by account %#v is being used too soon!",
					uniqueAddress,
					twitterUsername,
				)
			})

			slack.Notify(
				slack.ChannelFaucetTweets,
				slack.SeverityInformational,
				"Tweet %#v was rate limited!",
				tweet,
			)

			return
		}

		// prevent people attempting to abuse race conditions by using redis as a
		// quick store to check if they should be paid out

		notSetBefore := state.SetNxTimed(uniqueAddress, true, StateKeyExpiry)

		if !notSetBefore {
			log.App(func(k *log.Log) {
				log.App(func(k *log.Log) {
					k.Format(
						"NX set to prevent abuse has activated for unique address %#v tweeted by %#v!",
						uniqueAddress,
						twitterUsername,
					)
				})
			})

			return
		}

		faucetRequest := faucet.FaucetRequest{
			Address: address,
			Time:    currentTime,
			Amount:  amountSent,
			Network: networkChosen,
		}

		queue.SendMessage(faucet.TopicFaucetRequest, faucetRequest)

		faucetDatabase.TrackFaucetUse(address, networkChosen)

		slack.Notify(
			slack.ChannelFaucetTweets,
			slack.SeverityInformational,
			`
Responded to the tweet %#v with a reply indicating that the faucet was serviced!`,

			tweet,
		)
	})
}
