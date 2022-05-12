package main

import (
	"encoding/base64"

	borsh "github.com/near/borsh-go"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/tribeca"
	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvSolanaWsUrl is the RPC url of the solana node to connect to
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvTribecaDataStorePubkey = `FLU_TRIBECA_DATA_STORE_PUBKEY`
)

func main() {
	var (
		tribecaDataStorePubkey = util.GetEnvOrFatal(EnvTribecaDataStorePubkey)
		solanaWsUrl            = util.GetEnvOrFatal(EnvSolanaWsUrl)

		programNotificationChan = make(chan solana.ProgramNotification)
		errChan                 = make(chan error)
	)

	solanaSubscription, err := solana.SubscribeProgram(
		solanaWsUrl,
		tribecaDataStorePubkey,
		programNotificationChan,
		errChan,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to subscribe to solana events!"
			k.Payload = err
		})
	}

	defer solanaSubscription.Close()

	for {
		select {
		case programNotification := <-programNotificationChan:
			log.Debug(func(k *log.Log) {
				k.Message = "Tribeca updated CalculateN Args!"
			})

			var calculateNArgs tribeca.TribecaProgramData

			dataBase64 := programNotification.Value.Account.Data[0]

			dataBinary, err := base64.StdEncoding.DecodeString(dataBase64)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to decode account data from base64!"
					k.Payload = err
				})
			}

			err = borsh.Deserialize(&calculateNArgs, dataBinary[8:])

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "Failed to decode data account!"
					k.Payload = err
				})
			}

			var (
				Delta   = calculateNArgs.Delta
				M       = calculateNArgs.M
				FreqDiv = calculateNArgs.FreqDiv
			)

			calculateNArgsInternal := types.TribecaProgramData{
				Delta:   Delta,
				M:       M,
				FreqDiv: FreqDiv,
				Network: "devnet",
				Chain:   "solana",
			}

			database.InsertNArgs(calculateNArgsInternal)

		case err := <-errChan:
			log.Fatal(func(k *log.Log) {
				k.Message = "Error from the Solana websocket!"
				k.Payload = err
			})
			return
		}
	}

}
