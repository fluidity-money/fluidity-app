package main

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/solana/aldrin"
	"github.com/fluidity-money/fluidity-app/common/solana/applications"
	"github.com/fluidity-money/fluidity-app/common/solana/orca"
	"github.com/fluidity-money/fluidity-app/common/solana/raydium"
	"github.com/fluidity-money/fluidity-app/common/solana/saber"
	"github.com/fluidity-money/fluidity-app/lib/queues/worker"
	types "github.com/fluidity-money/fluidity-app/lib/types/worker"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
)

func parseTransaction(solanaClient *solanaRpc.Client, fluidTokens map[string]string, transaction worker.SolanaParsedTransaction, saberRpc, saberProgramId, orcaProgramId, raydiumProgramId, aldrinProgramId string) ([]worker.SolanaDecoratedTransfer, error) {
	var (
		fee *big.Rat
		err error
	)

	var (
		transactionResult      = transaction.Transaction.Result
		transactionSignature   = transaction.Transaction.Signature
		transactionApplication = transaction.Transaction.Application
	)

	switch transactionApplication {
	case applications.ApplicationSpl:
		// no application, nothing to be done

	case applications.ApplicationSaber:
		fee, _, err = saber.GetSaberFees(saberRpc, transactionResult, saberProgramId)

	case applications.ApplicationOrca:
		fee, err = orca.GetOrcaFees(
			solanaClient,
			transactionResult,
			orcaProgramId,
			fluidTokens,
		)

	case applications.ApplicationRaydium:
		fee, err = raydium.GetRaydiumFees(
			solanaClient,
			transactionResult,
			raydiumProgramId,
			fluidTokens,
		)

	case applications.ApplicationAldrin:
		fee, err = aldrin.GetAldrinFees(
			solanaClient,
			transactionResult,
			aldrinProgramId,
			fluidTokens,
		)

	default:
		err = fmt.Errorf(
			"application number wasn't expected: %v",
			transactionApplication,
		)
	}

	if err != nil {
		return nil, fmt.Errorf(
			"application decoding failed for parsed transaction %#v: %v",
			transactionSignature,
			err,
		)
	}

	var (
		transfers      = transaction.Transfers
		appTransaction = transaction.Transaction
		decorated      = make([]worker.SolanaDecoratedTransfer, len(transfers))
	)

	for i, transfer := range transfers {
		var (
			token          = transfer.TokenDetails
			senderSpl      = transfer.SenderAddress
			recipientSpl   = transfer.RecipientAddress
			senderOwner    = transfer.SolanaSenderOwnerAddress
			recipientOwner = transfer.SolanaRecipientOwnerAddress
		)

		var decorator *types.SolanaWorkerDecorator

		if fee != nil {
			decorator_ := types.SolanaWorkerDecorator{
				ApplicationFee: fee,
			}

			decorator = &decorator_
		}

		decoratedTransfer := worker.SolanaDecoratedTransfer{
			Transaction:           appTransaction,
			Token:                 token,
			SenderSplAddress:      senderSpl,
			RecipientSplAddress:   recipientSpl,
			SenderOwnerAddress:    senderOwner,
			RecipientOwnerAddress: recipientOwner,
			Decorator:             decorator,
		}

		decorated[i] = decoratedTransfer
	}

	return decorated, nil
}
