package main

import (
	"math/big"

	"github.com/fluidity-money/fluidity-app/cmd/microservice-solana-application-server/lib/saber"
	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/queue"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	types "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"
)

const (
    // EnvSaberSwapProgramid is the program ID of the saber swap program (not router)
    EnvSaberSwapProgramId = `FLU_SOLANA_SABER_SWAP_PROGRAM_ID`

    // EnvSaberRpcUrl to use when making lookups to their infrastructure
    EnvSaberRpcUrl = `FLU_SOLANA_SABER_RPC_URL`
)

func main() {
    var (
        saberRpcUrl        = util.GetEnvOrFatal(EnvSaberRpcUrl)
        saberSwapProgramId = util.GetEnvOrFatal(EnvSaberSwapProgramId)
    )

    worker.GetSolanaBufferedParsedTransactions(func (transactions worker.SolanaBufferedParsedTransactions) {
        transfers := make([]worker.SolanaDecoratedTransfer, 0)

        for _, transaction := range transactions.Transactions {
            var (
                app = transaction.Transaction.Application
                hash = transaction.Transaction.Signature
            )

            decorated, err := parseTransaction(transaction, saberRpcUrl, saberSwapProgramId)

            if err != nil {
                log.Fatal(func(k *log.Log) {
                    k.Format(
                        "Failed to parse an application event! %w",
                        err,
                    )
                })
            }

            if decorated == nil {
                log.App(func(k *log.Log) {
                    k.Format(
                        "Application didn't return a transfer, app index %d, transaction %s",
                        app,
                        hash,
                    )
                })
                continue
            }

            transfers = append(transfers, decorated...)
        }

        bufferedTransfers := worker.SolanaBufferedTransfers {
            Transfers: transfers,
        }

        queue.SendMessage(worker.TopicSolanaBufferedTransfers, bufferedTransfers)
    })
}

func parseTransaction(transaction worker.SolanaParsedTransaction, saberRpc, saberProgramId string) ([]worker.SolanaDecoratedTransfer, error) {
    var (
        fee *big.Rat
        err error
    )

    switch transaction.Transaction.Application {
    case applications.ApplicationSaber:
        fee, _, err = saber.GetSaberFees(saberRpc, transaction, saberProgramId)
    }

    if err != nil {
        return nil, err
    }

    var (
        transfers = transaction.Transfers
        appTransaction = transaction.Transaction
        decorated = make([]worker.SolanaDecoratedTransfer, len(transfers))
    )

    for i, transfer := range(transfers) {
        var (
            token = transfer.TokenDetails
            senderSpl = transfer.SenderAddress
            recipientSpl = transfer.RecipientAddress
            senderOwner = transfer.SolanaSenderOwnerAddress
            recipientOwner = transfer.SolanaRecipientOwnerAddress
        )

        var decorator *types.SolanaWorkerDecorator

        if fee != nil {
            decorator_ := types.SolanaWorkerDecorator {
                ApplicationFee: fee,
            }

            decorator = &decorator_
        }

        decoratedTransfer := worker.SolanaDecoratedTransfer {
            Transaction: appTransaction,
            Token: token,
            SenderSplAddress: senderSpl,
            RecipientSplAddress: recipientSpl,
            SenderOwnerAddress: senderOwner,
            RecipientOwnerAddress: recipientOwner,
            Decorator: decorator,
        }

        decorated[i] = decoratedTransfer
    }

    return decorated, nil
}

