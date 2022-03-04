package main

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/faucet"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/web"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
)

type (
	UniquePhraseRequest struct {
		Network string `json:"network"`
		Address string `json:"address"`
	}

	UniquePhraseResponse struct {
		ResponseMessage string `json:"response_message"`
		WasError        bool   `json:"was_error"`
		UniqueAddress   string `json:"unique_phrase"`
	}
)

func uniquePhraseOkay(message, address string) UniquePhraseResponse {
	return UniquePhraseResponse{
		ResponseMessage: message,
		WasError:        false,
		UniqueAddress:   address,
	}
}

func uniquePhraseError(message string) UniquePhraseResponse {
	return UniquePhraseResponse{
		ResponseMessage: message,
		WasError:        true,
	}
}

func HandleUniquePhrase(w http.ResponseWriter, r *http.Request) interface{} {

	var (
		ipAddress = web.GetIpAddress(r)

		faucetRequest UniquePhraseRequest
	)

	err := json.NewDecoder(r.Body).Decode(&faucetRequest)

	if err != nil {
		log.App(func(k *log.Log) {
			k.Format(
				"Failed to decode a message from IP address %#v!",
				ipAddress,
			)

			k.Payload = err
		})

		return nil
	}

	var (
		network_ = faucetRequest.Network
		address = faucetRequest.Address
	)

	address = strings.ToLower(address)

	switch network_ {
	case string(network.NetworkEthereum):

	default:
		log.App(func(k *log.Log) {
			k.Format(
				"Network specified by user at ip %#v was not ethereum! Was %#v!",
				ipAddress,
				network_,
			)
		})

		return uniquePhraseError("Bad network!")
	}

	if !filterAddress(address) {
		log.App(func(k *log.Log) {
			k.Format(
				"User at ip address %#v specified a bad address! Was %#v!",
				ipAddress,
				address,
			)
		})

		return uniquePhraseError("Bad address!")
	}

	// see if the user has asked for the phrase before using their address

	existingPhrase := faucet.GetUniqueAddress(address)

	if existingPhrase != "" {
		return UniquePhraseResponse{
			ResponseMessage: "Phrase already received!",
			WasError:        true,
			UniqueAddress:   existingPhrase,
		}
	}

	ethereumAddress := ethereum.AddressFromString(address)

	uniqueAddress, _ := generateUniqueAddressAndNonce(ethereumAddress)

	faucetUser := faucet.FaucetUser{
		Address:       address,
		UniqueAddress: uniqueAddress,
		IpAddress:     ipAddress,
		Network:       network.NetworkEthereum,
	}

	faucet.InsertFaucetUser(faucetUser)

	return uniquePhraseOkay("success", uniqueAddress)
}
