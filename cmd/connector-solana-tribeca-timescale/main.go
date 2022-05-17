package main

import (
	"encoding/base64"

	goSolana "github.com/gagliardetto/solana-go"
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

	// EnvFluidityPubkey is the program id of the tribeca data store account
	EnvTribecaDataStorePubkey = `FLU_TRIBECA_DATA_STORE_PUBKEY`
)

func main() {
	var (
		tribecaDataStorePubkey_ = util.GetEnvOrFatal(EnvTribecaDataStorePubkey)
		solanaWsUrl             = util.GetEnvOrFatal(EnvSolanaWsUrl)

		accountNotificationChan = make(chan solana.AccountNotification)
		errChan                 = make(chan error)
	)

	tribecaDataStorePubkey := goSolana.MustPublicKeyFromBase58(tribecaDataStorePubkey_)

	var (
		tribecaDataStoreString = "calculateNArgs"
		tribecaDataStoreBytes_ = []byte(tribecaDataStoreString)
		tribecaDataStoreBytes  = [][]byte{tribecaDataStoreBytes_}
	)

	tribecaDataStorePda, _, err := goSolana.FindProgramAddress(
		tribecaDataStoreBytes,
		tribecaDataStorePubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to derive tribeca data store pda!"
			k.Payload = err
		})
	}

	solanaSubscription, err := solana.SubscribeAccount(
		solanaWsUrl,
		tribecaDataStorePda.String(),
		accountNotificationChan,
		errChan,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to subscribe to solana events!"
			k.Payload = err
		})
	}

	defer solanaSubscription.Close()

	for {
		select {
		case accountNotification := <-accountNotificationChan:
			log.Debug(func(k *log.Log) {
				k.Message = "Tribeca updated CalculateN Args!"
			})

			var calculateNArgs tribeca.TribecaProgramData

			dataBase64 := accountNotification.Value.Data[0]

			dataBinary, err := base64.StdEncoding.DecodeString(dataBase64)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "failed to decode account data from base64!"
					k.Payload = err
				})
			}

			err = borsh.Deserialize(&calculateNArgs, dataBinary[8:])

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "failed to decode data account!"
					k.Payload = err
				})
			}

			var (
				deltaWeightNum   = calculateNArgs.DeltaWeightNum
				deltaWeightDenom = calculateNArgs.DeltaWeightDenom
				winningClasses   = calculateNArgs.WinningClasses
				payoutFreqNum    = calculateNArgs.PayoutFreqNum
				payoutFreqDenom  = calculateNArgs.PayoutFreqDenom
			)

			calculateNArgsInternal := types.TribecaProgramData{
				Chain:            "solana",
				Network:          "devnet",
				PayoutFreqNum:    int64(payoutFreqNum),
				PayoutFreqDenom:  int64(payoutFreqDenom),
				DeltaWeightNum:   int64(deltaWeightNum),
				DeltaWeightDenom: int64(deltaWeightDenom),
				WinningClasses:   int(winningClasses),
			}

			database.InsertNArgs(calculateNArgsInternal)

		case err := <-errChan:
			log.Fatal(func(k *log.Log) {
				k.Message = "error from the Solana websocket!"
				k.Payload = err
			})
		}
	}

}
