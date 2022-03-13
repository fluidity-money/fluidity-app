package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	faucetTypes "github.com/fluidity-money/fluidity-app/lib/types/faucet"
	"github.com/fluidity-money/fluidity-app/lib/databases/postgres/faucet"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/web"
)

type (
	UniquePhraseRequest struct {
		Network   string                           `json:"network"`
		Address   string                           `json:"address"`
		TokenName faucetTypes.FaucetSupportedToken `json:"token_name"`
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
		network_  = faucetRequest.Network
		address   = faucetRequest.Address
		tokenName = faucetRequest.TokenName
	)

	switch network_ {
	case string(network.NetworkEthereum):
	case string(network.NetworkSolana):

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

	networkUsed := network.BlockchainNetwork(network_)

	switch networkUsed {

	case network.NetworkEthereum:
		if !filterAddressEthereum(address) {
			log.App(func(k *log.Log) {
				k.Format(
					"User at ip address %#v specified a bad Ethereum address! Was %#v!",
					ipAddress,
					address,
				)
			})

			return uniquePhraseError("Bad address!")
		}

	case network.NetworkSolana:
		if !filterAddressSolana(address) {
			log.App(func(k *log.Log) {
				k.Format(
					"User at ip address %#v specified a bad Solana address! Was %#v!",
					ipAddress,
					address,
				)
			})

			return uniquePhraseError("Bad address!")
		}
	}

	var adjustedAddress string

	switch networkUsed {

	case network.NetworkEthereum:
		adjustedAddress = string(ethereum.AddressFromString(address))

	case network.NetworkSolana:
		adjustedAddress = address

	default:
		panic(fmt.Sprintf("Address was not Solana or Ethereum! Was %#v!", networkUsed))
	}

	// see if the user has asked for the phrase before using their address

	existingPhrase := faucet.GetUniqueAddress(adjustedAddress)

	if existingPhrase != "" {
		return UniquePhraseResponse{
			ResponseMessage: "Phrase already received!",
			WasError:        true,
			UniqueAddress:   existingPhrase,
		}
	}

	uniqueAddress, _ := generateUniqueAddressAndNonce(adjustedAddress)

	// validate the token name
	var tokenNameOk = false

	switch tokenName {

	// break if network and name are correct, otherwise fail
	case faucetTypes.TokenfDAI:
		if networkUsed == network.NetworkEthereum {
			tokenNameOk = true
			break		
		}

	case faucetTypes.TokenfUSDC:
		tokenNameOk = true
		break

	case faucetTypes.TokenfUSDT:
		if networkUsed == network.NetworkEthereum {
			tokenNameOk = true
			break		
		}

	default:
		break
	}

	if !tokenNameOk {
		log.App(func(k *log.Log) {
			k.Format(
				"User at ip address %#v specified a bad token name on network %#v! Was %#v!",
				ipAddress,
				networkUsed,
				tokenName,
			)
		})
		return uniquePhraseError("Bad Token!")
	}

	faucetUser := faucet.FaucetUser{
		Address:       adjustedAddress,
		UniqueAddress: uniqueAddress,
		IpAddress:     ipAddress,
		Network:       networkUsed,
		TokenName:     tokenName,
	}

	log.Debug(func(k *log.Log) {
		var buf strings.Builder

		if err := json.NewEncoder(&buf).Encode(faucetUser); err != nil {
			panic(err)
		}

		k.Format("JSON blob being inserted and sent is %v", buf.String())
	})

	faucet.InsertFaucetUser(faucetUser)

	return uniquePhraseOkay("success", uniqueAddress)
}
