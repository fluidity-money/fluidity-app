package microservice_solana_faucet_send_amounts

import (
	"github.com/btcsuite/btcutil/base58"
	"github.com/gagliardetto/solana-go"
)

func base58PublicKey(key solana.PublicKey) string {
	return base58.Encode(key[:])
}
