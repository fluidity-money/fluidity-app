// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/balancer"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/curve"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/dodo"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/multichain"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/oneinch"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/uniswap"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/xy-finance"
	libApps "github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	libEthereum "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// ApplicationNone is the nil value representing a transfer.
	ApplicationNone libApps.Application = iota
	ApplicationUniswapV2
	ApplicationBalancerV2
	ApplicationOneInchLPV2
	ApplicationOneInchLPV1
	ApplicationMooniswap
	ApplicationOneInchFixedRateSwap
	ApplicationDodoV2
	ApplicationCurve
	ApplicationMultichain
	ApplicationXyFinance
)

// GetApplicationFee to find the fee (in USD) paid by a user for the application interaction
// returns nil, nil in the case where the application event is legitimate, but doesn't involve
// the fluid asset we're tracking, e.g. in a multi-token pool where two other tokens are swapped
// if a receipt is passed, will be passed to the application if it can use it
func GetApplicationFee(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, txReceipt ethereum.Receipt) (*big.Rat, ethereum.Address, worker.EthereumAppFees, error) {
	var (
		fee      *big.Rat
		emission worker.EthereumAppFees
		err      error
		utility  ethereum.Address
	)

	switch transfer.Application {
	case ApplicationUniswapV2:
		fee, err = uniswap.GetUniswapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		utility = ethereum.AddressFromString("uniswap")
		emission.UniswapV2 += util.MaybeRatToFloat(fee)
	case ApplicationBalancerV2:
		fee, err = balancer.GetBalancerFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.BalancerV2 += util.MaybeRatToFloat(fee)
	case ApplicationOneInchLPV2:
		fee, err = oneinch.GetOneInchLPFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.OneInchV2 += util.MaybeRatToFloat(fee)
	case ApplicationOneInchLPV1:
		fee, err = oneinch.GetOneInchLPFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.OneInchV1 += util.MaybeRatToFloat(fee)
	case ApplicationMooniswap:
		fee, err = oneinch.GetMooniswapV1Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Mooniswap += util.MaybeRatToFloat(fee)
	case ApplicationOneInchFixedRateSwap:
		fee, err = oneinch.GetFixedRateSwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.OneInchFixedRate += util.MaybeRatToFloat(fee)
	case ApplicationDodoV2:
		fee, err = dodo.GetDodoV2Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
			txReceipt,
		)

		emission.DodoV2 += util.MaybeRatToFloat(fee)
	case ApplicationCurve:
		fee, err = curve.GetCurveSwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Curve += util.MaybeRatToFloat(fee)
	case ApplicationMultichain:
		fee, err = multichain.GetMultichainAnySwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Multichain += util.MaybeRatToFloat(fee)
	case ApplicationXyFinance:
		fee, err = xy_finance.GetXyFinanceSwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
			txReceipt,
		)

		emission.XyFinance += util.MaybeRatToFloat(fee)

	default:
		err = fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}

	return fee, utility, emission, err
}

// GetApplicationTransferParties to find the parties considered for payout from an application interaction.
// In the case of an AMM (such as Uniswap) the transaction sender receives the majority payout every time,
// with the recipient tokens being effectively burnt (sent to the contract). In the case of a P2P swap,
// such as a DEX, the party sending the fluid tokens receives the majority payout.
func GetApplicationTransferParties(transaction ethereum.Transaction, transfer worker.EthereumApplicationTransfer) (libEthereum.Address, libEthereum.Address, error) {
	var (
		logAddress  = transfer.Log.Address
		nilAddress  libEthereum.Address
	)

	switch transfer.Application {
	case ApplicationUniswapV2:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		// and the rest to the Uniswap contract
		return transaction.From, logAddress, nil
	case ApplicationOneInchLPV2,
		ApplicationOneInchLPV1,
		ApplicationMooniswap,
		ApplicationOneInchFixedRateSwap:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		return transaction.From, logAddress, nil
	case ApplicationBalancerV2:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		// and the rest to the Balancer Vault
		return transaction.From, logAddress, nil
	case ApplicationDodoV2:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		// and the rest to the Dodo Pool
		return transaction.From, logAddress, nil
	case ApplicationCurve:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationMultichain:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationXyFinance:
		// Give the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil

	default:
		return nilAddress, nilAddress, fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}
}
