// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/apeswap"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/balancer"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/camelot"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/chronos"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/curve"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/dodo"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/gtrade"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/meson"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/multichain"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/oneinch"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/saddle"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/sushiswap"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/uniswap"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/kyber"
	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/xy-finance"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	libApps "github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	libEthereum "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/fluidity-money/fluidity-app/lib/util"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	// ApplicationNone is the nil value representing a transfer.
	ApplicationNone libApps.Application = iota
	ApplicationUniswapV3
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
	ApplicationApeswap
	ApplicationSaddle
	ApplicationGTradeV6_1
	ApplicationMeson
	ApplicationCamelot
	ApplicationChronos
	ApplicationSushiswap
	ApplicationKyberClassic
)

// GetApplicationFee to find the fee (in USD) paid by a user for the application interaction
// returns (feeData wiht Fee set to nil, ni) in the case where the application event is legitimate, but doesn't involve
// the fluid asset we're tracking, e.g. in a multi-token pool where two other tokens are swapped
// if a receipt is passed, will be passed to the application if it can use it
func GetApplicationFee(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, txReceipt ethereum.Receipt, inputData misc.Blob) (applications.ApplicationFeeData, worker.EthereumAppFees, error) {
	var (
		feeData  applications.ApplicationFeeData
		emission worker.EthereumAppFees
		err      error
	)

	switch transfer.Application {
	case ApplicationUniswapV3:
		feeData, err = uniswap.GetUniswapV3Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.UniswapV3 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationSushiswap:
		feeData, err = sushiswap.GetSushiswapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)
		emission.Sushiswap += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationUniswapV2:
		feeData, err = uniswap.GetUniswapV2Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.UniswapV2 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationBalancerV2:
		feeData, err = balancer.GetBalancerFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.BalancerV2 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationOneInchLPV2:
		feeData, err = oneinch.GetOneInchLPFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.OneInchV2 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationOneInchLPV1:
		feeData, err = oneinch.GetOneInchLPFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.OneInchV1 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationMooniswap:
		feeData, err = oneinch.GetMooniswapV1Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Mooniswap += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationOneInchFixedRateSwap:
		feeData, err = oneinch.GetFixedRateSwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.OneInchFixedRate += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationDodoV2:
		feeData, err = dodo.GetDodoV2Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
			txReceipt,
		)

		emission.DodoV2 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationCurve:
		feeData, err = curve.GetCurveSwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Curve += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationMultichain:
		feeData, err = multichain.GetMultichainAnySwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Multichain += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationXyFinance:
		feeData, err = xy_finance.GetXyFinanceSwapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
			txReceipt,
		)

		emission.XyFinance += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationApeswap:
		feeData, err = apeswap.GetApeswapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Apeswap += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationSaddle:
		feeData, err = saddle.GetSaddleFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
			txReceipt,
		)

		emission.Saddle += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationGTradeV6_1:
		feeData, err = gtrade.GetGtradeV6_1Fees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
			txReceipt,
		)

		emission.GTradeV6_1 += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationMeson:
		feeData, err = meson.GetMesonFees(
			transfer,
			inputData,
		)

		emission.Meson += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationCamelot:
		feeData, err = camelot.GetCamelotFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Camelot += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationChronos:
		feeData, err = chronos.GetChronosFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Chronos += util.MaybeRatToFloat(feeData.Fee)
	case ApplicationKyberClassic:
		feeData, err = kyberClassic.GetKyberClassicFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.KyberClassic += util.MaybeRatToFloat(feeData.Fee)

	default:
		err = fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}

	return feeData, emission, err
}

// GetApplicationTransferParties to find the parties considered for payout from an application interaction.
// In the case of an AMM (such as Uniswap) the transaction sender receives the majority payout every time,
// with the recipient tokens being effectively burnt (sent to the contract). In the case of a P2P swap,
// such as a DEX, the party sending the fluid tokens receives the majority payout.
func GetApplicationTransferParties(transaction ethereum.Transaction, transfer worker.EthereumApplicationTransfer) (libEthereum.Address, libEthereum.Address, error) {
	var (
		logAddress      = transfer.Log.Address
		contractAddress = transaction.To
		nilAddress      libEthereum.Address
	)

	switch transfer.Application {
	case ApplicationUniswapV2,
		ApplicationUniswapV3:
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
	case ApplicationApeswap:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationSaddle:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationGTradeV6_1:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationMeson:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		mesonSender, err := meson.GetInitiator(transaction.Data)
		if err != nil {
			return libEthereum.ZeroAddress, libEthereum.ZeroAddress, err
		}

		mesonSenderAddress := libEthereum.AddressFromString(mesonSender)

		return mesonSenderAddress, contractAddress, nil
	case ApplicationCamelot:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationChronos:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationSushiswap:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil
	case ApplicationKyberClassic:
		// Gave the majority payout to the swap-maker (i.e. transaction sender)
		// and rest to pool
		return transaction.From, logAddress, nil

	default:
		return nilAddress, nilAddress, fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}
}
