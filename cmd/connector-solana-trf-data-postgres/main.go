package main

import (
	"encoding/base64"

	goSolana "github.com/gagliardetto/solana-go"
	borsh "github.com/near/borsh-go"

	"github.com/fluidity-money/fluidity-app/common/solana"
	trf_data_store "github.com/fluidity-money/fluidity-app/common/solana/trf-data-store"
	database "github.com/fluidity-money/fluidity-app/lib/databases/postgres/payout"
	"github.com/fluidity-money/fluidity-app/lib/log"
	types "github.com/fluidity-money/fluidity-app/lib/types/payout"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvSolanaWsUrl is the RPC url of the solana node to connect to
	EnvSolanaWsUrl = `FLU_SOLANA_WS_URL`

	// EnvSolanaNetwork is the network the TRF variables affect
	EnvSolanaNetwork = `FLU_SOLANA_NETWORK`

	// EnvFluidityPubkey is the program id of the trf data store account
	EnvTrfDataStoreProgramId = `FLU_TRF_DATA_STORE_PROGRAM_ID`
)

func main() {
	var (
		solanaWsUrl = util.PickEnvOrFatal(EnvSolanaWsUrl)

		trfDataStoreProgramId = util.GetEnvOrFatal(EnvTrfDataStoreProgramId)
		solanaNetwork         = util.GetEnvOrFatal(EnvSolanaNetwork)

		accountNotificationChan = make(chan solana.AccountNotification)
		errChan                 = make(chan error)
	)

	trfDataStorePubkey, err := goSolana.PublicKeyFromBase58(
		trfDataStoreProgramId,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format(
				"Failed to get the trf progarm store id %v, %#v",
				EnvTrfDataStoreProgramId,
				trfDataStoreProgramId,
			)

			k.Payload = err
		})
	}

	var (
		trfDataStoreString = "trfDataStore"
		trfDataStoreBytes_ = []byte(trfDataStoreString)
		trfDataStoreBytes  = [][]byte{trfDataStoreBytes_}
	)

	trfDataStorePda, _, err := goSolana.FindProgramAddress(
		trfDataStoreBytes,
		trfDataStorePubkey,
	)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "failed to derive trf-data-store pda!"
			k.Payload = err
		})
	}

	solanaSubscription, err := solana.SubscribeAccount(
		solanaWsUrl,
		trfDataStorePda.String(),
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
				k.Message = "Tribeca updated TRF vars!"
			})

			var trfDataStoreData trf_data_store.TrfDataStore

			trfDataStoreDataBase64 := accountNotification.Value.Data[0]

			trfDataStoreDataBinary, err := base64.StdEncoding.DecodeString(trfDataStoreDataBase64)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "failed to decode account data from base64!"
					k.Payload = err
				})
			}

			// remove account discriminator from data binary
			trfDataStoreAccData := trfDataStoreDataBinary[8:]

			err = borsh.Deserialize(&trfDataStoreData, trfDataStoreAccData)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Message = "failed to decode data account!"
					k.Payload = err
				})
			}

			var (
				deltaWeightNum   = trfDataStoreData.DeltaWeightNum
				deltaWeightDenom = trfDataStoreData.DeltaWeightDenom
				winningClasses   = trfDataStoreData.WinningClasses
				payoutFreqNum    = trfDataStoreData.PayoutFreqNum
				payoutFreqDenom  = trfDataStoreData.PayoutFreqDenom
			)

			trfVars := types.TrfVars{
				Chain:            "solana",
				Network:          solanaNetwork,
				PayoutFreqNum:    int64(payoutFreqNum),
				PayoutFreqDenom:  int64(payoutFreqDenom),
				DeltaWeightNum:   int64(deltaWeightNum),
				DeltaWeightDenom: int64(deltaWeightDenom),
				WinningClasses:   int(winningClasses),
			}

			database.InsertTrfVars(trfVars)

		case err := <-errChan:
			log.Fatal(func(k *log.Log) {
				k.Message = "error from the Solana websocket!"
				k.Payload = err
			})
		}
	}

}
