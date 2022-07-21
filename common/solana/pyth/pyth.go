// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package pyth

import (
	"context"
	"fmt"
	"math/big"

	solana "github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

type (
	// pyth enum {Unknown, Price}
	PriceType uint32

	// pyth Exponentially-weighted moving average
	Ema struct {
		Val   int64
		Numer int64
		Denom int64
	}

	// pyth enum {Unknown, Trading, Halted, Auction}
	PriceStatus uint8

	// pyth enum {NoCorpAct}
	CorpAction uint8

	PriceInfo struct {
		// current price
		Price int64
		// confidence interval
		Conf uint64
		// status of price
		Status PriceStatus
		// notificatoin of corporate action
		CorpAct CorpAction
		PubSlot uint64
	}

	PriceComp struct {
		// key of contributing publisher
		Publisher solana.PublicKey
		// the price used to compute the current aggregate price
		Agg PriceInfo
		// The publisher's latest price. This price will be incorporated into the aggregate price
		// when price aggregation runs next.
		Latest PriceInfo
	}

	Price struct {
		// pyth magic number
		Magic uint32
		// program version
		Ver uint32
		// account type
		Atype uint32
		// price account size
		Size uint32
		// price or calculation type
		Ptype PriceType
		// price exponent
		Expo int32
		// number of component prices
		Num uint32
		// number of quoters that make up aggregate
		Num_qt uint32
		// slot of last valid (not unknown) aggregate price
		Last_slot uint64
		// valid slot-time of agg. price
		Valid_slot uint64
		// time-weighted average price
		Twap Ema
		// time-weighted average confidence interval
		Twac Ema
		// space for future derived values
		Drv1 int64
		// space for future derived values
		Drv2 int64
		// product account key
		Prod solana.PublicKey
		// next Price account in linked list
		Next solana.PublicKey
		// valid slot of previous update
		Prev_slot uint64
		// aggregate price of previous update
		Prev_price int64
		// confidence interval of previous update
		Prev_conf uint64
		// space for future derived values
		Drv3 int64
		// aggregate price info
		Agg PriceInfo
		// price components one per quoter
		Comp [32]PriceComp
	}
)

func GetPrice(solanaClient *rpc.Client, pricePubkey solana.PublicKey) (*big.Rat, error) {

	// get reserve bytes

	resp, err := solanaClient.GetAccountInfo(
		context.TODO(),
		pricePubkey,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get price account with pubkey %#v! %v",
			pricePubkey,
			err,
		)
	}

	// deserialise price bytes

	price := new(Price)

	err = borsh.Deserialize(price, resp.Value.Data.GetBinary())

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to deserialize price data! %v",
			err,
		)
	}

	if price.Magic != 0xa1b2c3d4 {
		return nil, fmt.Errorf(
			"Bad pyth magic bytes with pubkey %#v!",
			pricePubkey,
		)
	}

	priceExpo := big.NewRat(10, 1)

	priceExpo = bigPowInt32(priceExpo, price.Expo)

	priceRat := new(big.Rat).SetInt64(price.Agg.Price)

	priceRat.Mul(priceRat, priceExpo)

	return priceRat, nil
}
