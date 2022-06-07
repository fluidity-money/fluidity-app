package main

import (
	"context"

	utility_gauge "github.com/fluidity-money/fluidity-app/common/solana/utility-gauge"
	"github.com/fluidity-money/fluidity-app/lib/log"
	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

func getGaugemeisterData(solanaClient *solanaRpc.Client, pubkey solana.PublicKey) *utility_gauge.Gaugemeister {

	accInfoRes, err := solanaClient.GetAccountInfo(
		context.Background(),
		pubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("failed to get gaugemeister account %v!", pubkey)
			k.Payload = err
		})
	}

	gaugemeisterDataBinary := accInfoRes.Value.Data.GetBinary()

	// remove anchor account discriminator from data binary
	gaugemeisterAccData := gaugemeisterDataBinary[8:]

	var gaugemeister utility_gauge.Gaugemeister

	err = borsh.Deserialize(&gaugemeister, gaugemeisterAccData)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to decode gaugemeister account data from rpc result!"
			k.Payload = err
		})
	}

	return &gaugemeister
}
