package api_fluidity_money

import (
	"crypto/ecdsa"
	"encoding/json"
	"net/http"

	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"
	"github.com/fluidity-money/fluidity-app/common/ethereum/fluidity"
	"github.com/fluidity-money/fluidity-app/lib/databases/timescale/spooler"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

type (
	RequestManualReward struct {
		TxHash string `json:"transation_hash"`
	}

	ManualRewardPayload struct {
		Reward fluidity.RewardArg `json:"reward"`
		Signature []byte `json:"signature"`
	}

	ResponseManualReward struct {
		Error *string `json:"error"`
		RewardPayload *ManualRewardPayload `json:"payload"`
	}
)

func manualRewardError(msg string) ResponseManualReward {
	return ResponseManualReward {
		Error: &msg,
		RewardPayload: nil,
	}
}

func generateManualRewardPayload(signers map[string]*ecdsa.PrivateKey, transaction spooler.PendingWinner) ManualRewardPayload {
	var (
		txHashString = transaction.TransactionHash.String()
		fromString = transaction.FromAddress.String()
		toString = transaction.ToAddress.String()
		amountInt = transaction.WinAmount
		shortName = transaction.TokenDetails.TokenShortName
	)

	signer, exists := signers[shortName]
	if !exists {
		log.Fatal(func (k *log.Log) {
		    k.Format("Signer for token %s not found!")
		})
	}

	var (
		txHash = ethCommon.HexToHash(txHashString)
		from = ethCommon.HexToAddress(fromString)
		to = ethCommon.HexToAddress(toString)
		amount = &amountInt.Int
	)

	encodedReward, err := fluidity.ManualRewardArguments.Pack(
		txHash,
		from,
		to,
		amount,
	)

	if err != nil {
	    log.Fatal(func (k *log.Log) {
	        k.Message = "Failed to encode manual reward args!"
	        k.Payload = err
	    })
	}

	hash := ethCrypto.Keccak256(encodedReward)

	sig, err := ethCrypto.Sign(hash, signer)

	if err != nil {
	    log.Fatal(func (k *log.Log) {
	        k.Message = "Failed to sign the hash of the manual reward args!"
	        k.Payload = err
	    })
	}

	rewardArg := fluidity.RewardArg {
		TransactionHash: txHash,
		FromAddress: from,
		ToAddress: to,
		WinAmount: amount,
	}

	container := ManualRewardPayload {
		Reward: rewardArg,
		Signature: sig,
	}

	return container
}

func GetManualRewardHandler(signers map[string]*ecdsa.PrivateKey) func(http.ResponseWriter, *http.Request) interface{} {
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

		hash := request.TxHash

		transaction := spooler.GetPendingRewardByHash(hash)

		if transaction == nil {
			return manualRewardError("transaction not found")
		}

		if transaction.RewardSent == true {
			return manualRewardError("reward already sent for this transaction")
		}

		payload := generateManualRewardPayload(signers, *transaction)

		res := ResponseManualReward {
			Error: nil,
			RewardPayload: &payload,
		}

		return res
	}
}

