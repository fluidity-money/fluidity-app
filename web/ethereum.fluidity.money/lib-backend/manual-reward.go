package api_fluidity_money

import (
	"crypto/ecdsa"
	"encoding/json"
	"math/big"
	"net/http"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/fluidity-money/fluidity-app/common/ethereum"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

type (
	// RequestManualReward is the API request type for the manual
	// reward route
	RequestManualReward struct {
		Address        string `json:"address"`
		TokenShortName string `json:"token_short_name"`
	}

	// ManualRewardArg to hold the arguments to call the manual reward
	// solidity function with
	ManualRewardArg struct {
		Token      token_details.TokenDetails `json:"token_details"`
		Winner     string                     `json:"winner"`
		WinAmount  *big.Int                   `json:"win_amount"`
		FirstBlock *big.Int                   `json:"first_block"`
		LastBlock  *big.Int                   `json:"last_block"`
	}

	// ManualRewardPayload is part of the message sent to users
	// as a reply to the manual reward route
	ManualRewardPayload struct {
		Reward    ManualRewardArg `json:"reward"`
		Signature []byte          `json:"signature"`
	}

	// ResponseManualReward is the API response type for the
	// manual reward route
	ResponseManualReward struct {
		Error         *string              `json:"error"`
		RewardPayload *ManualRewardPayload `json:"payload"`
	}
)

func manualRewardError(msg string) ResponseManualReward {
	return ResponseManualReward{
		Error:         &msg,
		RewardPayload: nil,
	}
}

func generateManualRewardPayload(tokens map[string]ethCommon.Address, chainid *misc.BigInt, signers map[string]*ecdsa.PrivateKey, reward worker.EthereumSpooledRewards) ManualRewardPayload {
	var (
		winnerString  = reward.Winner.String()
		amountInt     = reward.WinAmount
		firstBlockInt = reward.FirstBlock
		lastBlockInt  = reward.LastBlock
		tokenDetails  = reward.Token
		shortName     = tokenDetails.TokenShortName
	)

	signer, exists := signers[shortName]

	if !exists {
		log.Fatal(func(k *log.Log) {
			k.Format("Signer for token %v not found!", shortName)
		})
	}

	contractAddress, exists := tokens[shortName]

	if !exists {
	   log.Fatal(func (k *log.Log) {
		   k.Format("Couldn't find address for token %s", shortName)
	   })
	}

	var (
		winner     = ethCommon.HexToAddress(winnerString)
		amount     = &amountInt.Int
		chainidInt = &chainid.Int
		firstBlock = &firstBlockInt.Int
		lastBlock  = &lastBlockInt.Int
	)

	rewardArgs_ := []interface{} {
		contractAddress,
		chainidInt,
		winner,
		amount,
		firstBlock,
		lastBlock,
	}

	encodedReward, err := fluidity.ManualRewardArguments.Pack(rewardArgs_...)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to encode manual reward args!"
			k.Payload = err
		})
	}

	hash := ethCrypto.Keccak256(encodedReward)

	sig, err := ethCrypto.Sign(hash, signer)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to sign the hash of the manual reward args!"
			k.Payload = err
		})
	}

	rewardArgs := ManualRewardArg{
		Token: tokenDetails,
		Winner: winnerString,
		WinAmount: amount,
		FirstBlock: firstBlock,
		LastBlock: lastBlock,
	}

	container := ManualRewardPayload{
		Reward: rewardArgs,
		Signature: sig,
	}

	return container
}

func GetManualRewardHandler(tokens map[string]ethCommon.Address, chainid *misc.BigInt, signers map[string]*ecdsa.PrivateKey) func(http.ResponseWriter, *http.Request) interface{} {
	return func (w http.ResponseWriter, r *http.Request) interface{} {
		var (
			ipAddress = web.GetIpAddress(r)
			request   RequestManualReward
		)

		err := json.NewDecoder(r.Body).Decode(&request)

		if err != nil {
			log.App(func(k *log.Log) {
				k.Format(
					"Failed to decode a user's JSON request from ip %v for /manual-reward!",
					ipAddress,
				)

				k.Payload = err
			})

			return returnForbidden(w)
		}

		var (
			address       = addressRequestToEthereumAddress(request.Address)
			addressString = address.String()

			token = request.TokenShortName
		)

		winnings := spooler.GetPendingRewardsForAddress(addressString)

		spooledWinnings, err := ethereum.BatchWinningsByToken(winnings, address)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Message = "Failed to batch rewards!"
				k.Payload = err
			})
		}

		tokenWinnings, exists := spooledWinnings[token]

		if !exists {
			return manualRewardError("no rewards for that token")
		}

		payload := generateManualRewardPayload(tokens, chainid, signers, tokenWinnings)

		res := ResponseManualReward{
			Error:         nil,
			RewardPayload: &payload,
		}

		return res
	}
}
