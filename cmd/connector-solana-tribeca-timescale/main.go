package main

import (
	"github.com/fluidity-money/fluidity-app/cmd/connector-solana-tribeca-timescale/lib/solana"

	database "github.com/fluidity-money/fluidity-app/lib/databases/timescale/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/solana"
	"github.com/fluidity-money/fluidity-app/lib/util"

	"encoding/base64"

	borsh "github.com/near/borsh-go"
)

const (
	// EnvSolanaWsUrl is the RPC url of the solana node to connect to
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvFluidityPubkey is the program id of the fluidity program
	EnvTribecaPubkey = `FLU_TRIBECA_PROGRAM_ID`
)

func main() {
	var (
		tribecaPubkey = util.GetEnvOrFatal(EnvTribecaPubkey)
		solanaWsUrl   = util.GetEnvOrFatal(EnvSolanaWsUrl)

		programNotificationChan = make(chan solana.ProgramNotification)
		errChan                 = make(chan error)
	)

	solanaSubscription, err := solana.SubscribeProgram(solanaWsUrl, tribecaPubkey, programNotificationChan, errChan)

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

			var calculateNArgs solana.TribecaProgramData

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

			calculateNArgsInternal := types.TribecaProgramData{
				Crunchy: calculateNArgs.Crunchy,
				Smooth:  calculateNArgs.Smooth,
				Network: "solana",
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
