package main

import (
	"fmt"
	"math/big"
	"context"

	"github.com/fluidity-money/fluidity-app/lib/state"
	"github.com/ethereum/go-ethereum/ethclient"
	ethCommon "github.com/ethereum/go-ethereum/common"
)

func getNonce(client *ethclient.Client, from ethCommon.Address) (*big.Int, error) {
	// if there's no nonce in the db, fetch and write it
	// this can race if we have multiple clients, but
	// - once we have a value in the db, it's always safe to use it
	//   because of the atomic increment
	// - fetching the value concurrently is fine, because clients
	//   will fetch the same value and only the first will write it
	// so we don't care
	if count := state.Exists(RedisNonceKey); count == 0 {
		nonce, err := client.PendingNonceAt(context.Background(), from)

		if err != nil {
		    return nil, fmt.Errorf(
				"failed to fetch an account's pending nonce! %w",
				err,
			)
		}


		// only write the value if it doesn't exist, since another client
		// might have wrote (and used!) it by now
		state.SetNX(RedisNonceKey, int64(nonce))
	}

	newNonce := state.Incr(RedisNonceKey)

	// we store the current pending nonce, but redis' increment returns the
	// new value - subtract one to get the actual value to use
	newNonce = newNonce - 1

	return big.NewInt(newNonce), nil
}
