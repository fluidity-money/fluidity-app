// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

import (
	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
	// EnvSolanaRpcUrl is the url used to make Solana HTTP RPC requests
	EnvSolanaRpcUrl = `FLU_SOLANA_RPC_URL`

	// EnvSolanaTokenLookups is the map of fluid -> base tokens
	EnvSolanaTokenLookups = `FLU_SOLANA_TOKEN_LOOKUPS`

	// EnvSaberSwapProgramid is the program ID of the saber swap program (not router)
	EnvSaberSwapProgramId = `FLU_SOLANA_SABER_SWAP_PROGRAM_ID`

	// EnvSaberRpcUrl to use when making lookups to their infrastructure
	EnvSaberRpcUrl = `FLU_SOLANA_SABER_RPC_URL`

	// EnvOrcaProgramId is the program ID of the orca swap program
	EnvOrcaProgramId = `FLU_SOLANA_ORCA_PROGRAM_ID`

	// EnvRaydiumProgramId is the program ID of the Raydium swap program
	EnvRaydiumProgramId = `FLU_SOLANA_RAYDIUM_PROGRAM_ID`

	// EnvAldrinV1ProgramId is the program ID of the Aldrin swap program v. 1
	EnvAldrinV1ProgramId = `FLU_SOLANA_ALDRIN_V1_PROGRAM_ID`

	// EnvAldrinV2ProgramId is the program ID of the Aldrin swap program v. 2
	EnvAldrinV2ProgramId = `FLU_SOLANA_ALDRIN_V2_PROGRAM_ID`

	//  EnvLifinityProgramId is the program ID of the Lifinity swap program
	EnvLifinityProgramId = `FLU_SOLANA_LIFINITY_PROGRAM_ID`

	//  EnvMercurialProgramId is the program ID of the Mercurial swap program
	EnvMercurialProgramId = `FLU_SOLANA_MERCURIAL_PROGRAM_ID`

)

func main() {
	var (
		solanaRpcUrl = util.PickEnvOrFatal(EnvSolanaRpcUrl)

		saberRpcUrl         = util.GetEnvOrFatal(EnvSaberRpcUrl)
		saberSwapProgramId  = util.GetEnvOrFatal(EnvSaberSwapProgramId)
		orcaProgramId       = util.GetEnvOrFatal(EnvOrcaProgramId)
		raydiumProgramId    = util.GetEnvOrFatal(EnvRaydiumProgramId)
		aldrinProgramIdV1   = util.GetEnvOrFatal(EnvAldrinV1ProgramId)
		aldrinProgramIdV2   = util.GetEnvOrFatal(EnvAldrinV2ProgramId)
		lifinityProgramId   = util.GetEnvOrFatal(EnvLifinityProgramId)
		mercurialProgramId   = util.GetEnvOrFatal(EnvMercurialProgramId)

		fluidTokens = tokenListFromEnv(EnvSolanaTokenLookups)
	)

	solanaClient, err := rpc.New(solanaRpcUrl)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Message = "Failed to create the Solana call manager!"
			k.Payload = err
		})
	}

	worker.GetSolanaBufferedParsedTransactions(func(transactions worker.SolanaBufferedParsedTransactions) {
		transfers := make([]worker.SolanaDecoratedTransfer, 0)

		for transactionNumber, transaction := range transactions.Transactions {
			var (
				transactionApps      = transaction.Transaction.Applications
				transactionSignature = transaction.Transaction.Signature
			)

			decorated, err := parseTransaction(
				solanaClient,
				fluidTokens,
				transaction,
				saberRpcUrl,
				saberSwapProgramId,
				orcaProgramId,
				raydiumProgramId,
				aldrinProgramIdV1,
				aldrinProgramIdV2,
				lifinityProgramId,
				mercurialProgramId,
			)

			if err != nil {
				log.Fatal(func(k *log.Log) {
					k.Format(
						"Failed to parse an application at transaction %v! %v",
						transactionNumber,
						err,
					)
				})
			}

			if decorated == nil {
				log.App(func(k *log.Log) {
					k.Format(
						"Application didn't return a transfer, app indexes %+v, transaction %s",
						transactionApps,
						transactionSignature,
					)
				})

				continue
			}

			transfers = append(transfers, decorated...)
		}

		if len(transfers) > 0 {
			bufferedTransfers := worker.SolanaBufferedTransfers{
				Transfers:       transfers,
			}

			queue.SendMessage(
				worker.TopicSolanaBufferedTransfers,
				bufferedTransfers,
			)
		}
	})
}
