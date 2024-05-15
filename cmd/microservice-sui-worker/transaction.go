package main

import (
	"context"
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/sui"
	worker_types "github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/sui-go-sdk/models"
	"github.com/fluidity-money/sui-go-sdk/signer"
	suiSdk "github.com/fluidity-money/sui-go-sdk/sui"
)

// TODO utility in EthereumSpooledRewards has to be the address of the utility token
// createPayoutTransaction to call distribute_yield on the fluid token contract
func createPayoutTransaction(client suiSdk.ISuiAPI, fluidToken, baseToken sui.SuiToken, rewards worker_types.EthereumSpooledRewards, suiPayoutArgs payoutArgs, workerAddress string) (models.TxnMetaData, error) {
	var (
		prizePoolVault = suiPayoutArgs.PrizePoolVault
		scallopVersion = suiPayoutArgs.ScallopVersion
		scallopMarket  = suiPayoutArgs.ScallopMarket
		clock          = suiPayoutArgs.Clock
	)

	var winners []string
	var amounts []uint64

	for _, r := range rewards.Rewards {
		for address, win := range r {
			winners = append(winners, address.String())
			amounts = append(amounts, win.Uint64())
		}
	}

	// manually find the largest SUI token to use for gas payment
	// assumes that the worker has at least one coin with enough balance to pay gas
	// and doesn't perform gas smashing
	coinsResponse, err := client.SuiXGetCoins(context.Background(), models.SuiXGetCoinsRequest{Owner: workerAddress})
	if err != nil {
		return models.TxnMetaData{}, fmt.Errorf(
			"failed to get SUI coins owned by worker %v - %v",
			workerAddress,
			err,
		)
	}
	var largestCoin struct {
		balance  *big.Int
		objectId string
	}
	for _, coin := range coinsResponse.Data {
		balance, _ := new(big.Int).SetString(coin.Balance, 10)

		if largestCoin.balance.Cmp(balance) == -1 {
			largestCoin = struct {
				balance  *big.Int
				objectId string
			}{
				balance:  balance,
				objectId: coin.CoinObjectId,
			}
		}
	}

	moveCall, err := client.MoveCall(context.Background(), models.MoveCallRequest{
		Signer:          workerAddress,
		PackageObjectId: fluidToken.PackageId,
		Module:          FluidityModule,
		Function:        PayoutFunction,
		TypeArguments:   []interface{}{baseToken.Type()},
		Arguments: []interface{}{
			prizePoolVault,
			scallopVersion,
			scallopMarket,
			clock,
			winners,
			amounts,
		},
		Gas: largestCoin.objectId,
		// 1 SUI
		// TODO determine this properly like the ts sdk
		/*
			const baseComputationCostWithOverhead =
				BigInt(dryRunResult.effects.gasUsed.computationCost) + safeOverhead;

			const gasBudget =
				baseComputationCostWithOverhead +
				BigInt(dryRunResult.effects.gasUsed.storageCost) -
				BigInt(dryRunResult.effects.gasUsed.storageRebate);

			// Set the budget to max(computation, computation + storage - rebate)
			this.setGasBudget(
				gasBudget > baseComputationCostWithOverhead ? gasBudget : baseComputationCostWithOverhead,
			);
		*/
		GasBudget: "1000000000",
	})

	if err != nil {
		return models.TxnMetaData{}, fmt.Errorf(
			"failed to create move call to distribute yield %v",
			err,
		)
	}

	return moveCall, nil
}

// makePayouts to post the batched payouts transaction on chain
func makePayouts(client suiSdk.ISuiAPI, signer signer.Signer, txnMetaData models.TxnMetaData) error {
	// TODO probably don't need to dry run unless required for gas calculation
	signed := txnMetaData.SignSerializedSigWith(signer.PriKey)
	_, err := client.SuiDryRunTransactionBlock(context.Background(), models.SuiDryRunTransactionBlockRequest{
		TxBytes: signed.TxBytes,
	})
	if err != nil {
		return fmt.Errorf(
			"failed to dry run winners payout transaction! %v",
			err,
		)
	}

	response, err := client.SignAndExecuteTransactionBlock(context.Background(), models.SignAndExecuteTransactionBlockRequest{
		TxnMetaData: txnMetaData,
		PriKey:      signer.PriKey,
		Options:     models.SuiTransactionBlockOptions{},
		RequestType: "WaitForEffectsCert",
	})

	if err != nil {
		return fmt.Errorf(
			"failed to execute winners payout transaction! %v",
			err,
		)
	}

	log.Debug(func(k *log.Log) {
		k.Message = "Executed payout transaction with digest"
		k.Payload = response.Digest
	})
	return nil
}
