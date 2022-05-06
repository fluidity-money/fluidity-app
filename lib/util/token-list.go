package util

import (
	"math"
	"math/big"
	"strconv"
	"strings"

	ethCommon "github.com/ethereum/go-ethereum/common"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/gagliardetto/solana-go"
)

// TokenDetailsBase for the minimum token information that is shared
type TokenDetailsBase struct {
	TokenDecimals *big.Rat
	TokenName     string
}

// TokenDetailsSolana containing information about tokens that we unpacked using
// the environment variables
type TokenDetailsSolana struct {
	FluidMintPubkey   solana.PublicKey 
	ObligationPubkey  solana.PublicKey 
	ReservePubkey     solana.PublicKey 
	PythPubkey        solana.PublicKey 
	SwitchboardPubkey solana.PublicKey
	TokenDecimals     *big.Rat
	TokenName         string
	Amount            float64
}

// TokenDetailsEthereum containing information about tokens that we unpacked using
// the environment variables
type TokenDetailsEthereum struct {
	FluidAddress  ethCommon.Address
	TokenName     string
	TokenDecimals *big.Rat
	Amount        float64
	// address is the optional parameter for the underlying token address
	// (required for AAVE lookup)
	Address       ethCommon.Address
}

func trimWhitespace(s string) string {
	return strings.Trim(s, " \n\t")
}

// GetTokensListSolana to parse a string list into separated token information
func GetTokensListSolana(tokensList_ string) []TokenDetailsSolana {
	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsSolana, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) != 7 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			fluidMint_   = trimWhitespace(tokenDetails_[0])
			//tokenDetails_[1] = tokenName
			decimals_    = trimWhitespace(tokenDetails_[2])
			obligation_  = trimWhitespace(tokenDetails_[3])
			reserve_     = trimWhitespace(tokenDetails_[4])
			pyth_        = trimWhitespace(tokenDetails_[5])
			switchboard_ = trimWhitespace(tokenDetails_[6])
		)

		fluidMint   := solana.MustPublicKeyFromBase58(fluidMint_)
		obligation  := solana.MustPublicKeyFromBase58(obligation_)
		reserve     := solana.MustPublicKeyFromBase58(reserve_)
		pyth        := solana.MustPublicKeyFromBase58(pyth_)
		switchboard := solana.MustPublicKeyFromBase58(switchboard_)

		decimals, err := strconv.Atoi(decimals_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert the decimals part of the token info! %#v",
					decimals_,
				)

				k.Payload = err
			})
		}

		decimalsAdjusted := math.Pow10(decimals)

		decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

		tokenDetail := TokenDetailsSolana{
			FluidMintPubkey:   fluidMint, 
			ObligationPubkey:  obligation,
			ReservePubkey:     reserve,	
			PythPubkey:        pyth,    			
			SwitchboardPubkey: switchboard,			
			TokenDecimals:     decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}

// GetTokensListEthereum to parse a string list into separated token information
func GetTokensListEthereum(tokensList_ string) []TokenDetailsEthereum {

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsEthereum, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) != 3 && len(tokenDetails_) != 4 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			fluidAddress_  = trimWhitespace(tokenDetails_[0])
			tokenName      = trimWhitespace(tokenDetails_[1])
			decimals_      = trimWhitespace(tokenDetails_[2])

			address ethCommon.Address
		)

		// we have the optional address parameter
		if len(tokenDetails_) == 4 {
			address_ := trimWhitespace(tokenDetails_[3])
			address  =  ethCommon.HexToAddress(address_)
		}

		fluidAddress := ethCommon.HexToAddress(fluidAddress_)

		decimals, err := strconv.Atoi(decimals_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert the decimals part of the token info! %#v",
					decimals_,
				)

				k.Payload = err
			})
		}

		decimalsAdjusted := math.Pow10(decimals)

		decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

		tokenDetail := TokenDetailsEthereum{
			FluidAddress:  fluidAddress,
			TokenName:     tokenName,
			TokenDecimals: decimalsRat,
			Address:       address,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}

func GetTokensListBase(tokensList_ string) []TokenDetailsBase {
	// addr, name, decimals

	tokensList := strings.Split(tokensList_, ",")

	tokenDetails := make([]TokenDetailsBase, len(tokensList))

	for i, tokenInfo_ := range tokensList {

		tokenDetails_ := strings.Split(tokenInfo_, ":")

		if len(tokenDetails_) < 2 {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Token information split not structured properly! %#v",
					tokenInfo_,
				)
			})
		}

		var (
			// (address)   = trimWhitespace(tokenDetails_[0])
			tokenName      = trimWhitespace(tokenDetails_[1])
			decimals_      = trimWhitespace(tokenDetails_[2])
		)

		decimals, err := strconv.Atoi(decimals_)

		if err != nil {
			log.Fatal(func(k *log.Log) {
				k.Format(
					"Failed to convert the decimals part of the token info! %#v",
					decimals_,
				)

				k.Payload = err
			})
		}

		decimalsAdjusted := math.Pow10(decimals)

		decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

		tokenDetail := TokenDetailsBase{
			TokenName:     tokenName,
			TokenDecimals: decimalsRat,
		}

		tokenDetails[i] = tokenDetail
	}

	return tokenDetails
}
