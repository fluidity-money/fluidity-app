package saber

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
)

type (
	responseData struct {
		Data tokenData `json:"data"`
	}

	tokenData struct {
		Pools []pool `json:"pools"`
	}

	pool struct {
		AmmId string    `json:"ammId"`
		Name  string    `json:"name"`
		Coin  coin      `json:"coin"`
		Stats poolStats `json:"stats"`
	}

	coin struct {
		ChainId  int    `json:"chainId"`
		Address  string `json:"address"`
		Name     string `json:"name"`
		Decimals int    `json:"decimals"`
		Symbol   string `json:"symbol"`
		LogoURI  string `json:"logoURI"`
	}

	poolStats struct {
		Price float64 `json:"price"`
	}
)

// GetSaberPriceAndDecimals at the public key given using Saber's RPC
// over HTTP
func GetSaberPriceAndDecimals(saberRpcUrl, pubKey string) (*big.Rat, int, error) {
	request := map[string]interface{}{
		"query": "query AllPoolStats {pools {ammId name coin{chainId address name decimals symbol logoURI} stats {price}}}",
	}

	requestBuf := new(bytes.Buffer)

	encoder := json.NewEncoder(requestBuf)

	err := encoder.Encode(request)

	if err != nil {
		return nil, 0, fmt.Errorf(
			"failed to encode RPC call containing Saber RPC query: %w",
			err,
		)
	}

	r, err := http.Post(
		saberRpcUrl,
		"application/json",
		requestBuf,
	)

	if err != nil {
		return nil, 0, fmt.Errorf(
			"failed to make an RPC call to Saber RPC: %w",
			err,
		)
	}

	defer r.Body.Close()

	reader := json.NewDecoder(r.Body)

	var responseData responseData

	if err := reader.Decode(&responseData); err != nil {
		return nil, 0, fmt.Errorf(
			"failed to decode Saber RPC response: %w",
			err,
		)
	}

	for _, pool := range responseData.Data.Pools {
		if pool.Coin.Address != pubKey {
			continue
		}

		pricef := pool.Stats.Price

		decimals := pool.Coin.Decimals

		priceRat := new(big.Rat).SetFloat64(pricef)

		return priceRat, decimals, nil
	}

	err = fmt.Errorf(
		"failed to find token in Saber list, response data is %v",
		responseData,
	)

	return nil, 0, err
}
