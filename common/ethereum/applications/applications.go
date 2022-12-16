// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package applications

import (
	"fmt"
	"math/big"

	"github.com/fluidity-money/fluidity-app/common/ethereum/applications/apeswap"
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
	ApplicationApeswap
)

const (
	UniswapSwapLogTopic          = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
	BalancerSwapLogTopic         = "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b"
	OneInchLPV2SwapLogTopic      = "0xbd99c6719f088aa0abd9e7b7a4a635d1f931601e9f304b538dc42be25d8c65c6"
	OneInchLPV1SwapLogTopic      = "0x2a368c7f33bb86e2d999940a3989d849031aff29b750f67947e6b8e8c3d2ffd6"
	MooniswapSwapLogTopic        = "0x86c49b5d8577da08444947f1427d23ef191cfabf2c0788f93324d79e926a9302"
	OneInchFixedRateSwapLogTopic = "0x803540962ed9acbf87226c32486d71e1c86c2bdb208e771bab2fd8a626f61e89"
	DodoV2DODOSwapLogTopic       = "0xc2c0245e056d5fb095f04cd6373bc770802ebd1e6c918eb78fdef843cdb37b0f"
	CurveTokenExchangeLogTopic   = "0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140"
	MultichainLogAnySwapOut      = "0x97116cf6cd4f6412bb47914d6db18da9e16ab2142f543b86e207c24fbd16b23a"
	XyFinanceSourceChainSwap     = "0xe1e8548aad4bfb08650f3a6c68acd84675a69fb72d77b1f744b8a643c406b608"
	ApeswapLogTopic              = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"
)

// GetApplicationFee to find the fee (in USD) paid by a user for the application interaction
// returns nil, nil in the case where the application event is legitimate, but doesn't involve
// the fluid asset we're tracking, e.g. in a multi-token pool where two other tokens are swapped
// if a receipt is passed, will be passed to the application if it can use it
func GetApplicationFee(transfer worker.EthereumApplicationTransfer, client *ethclient.Client, fluidTokenContract ethCommon.Address, tokenDecimals int, txReceipt ethereum.Receipt) (*big.Rat, worker.EthereumAppFees, error) {
	var (
		fee      *big.Rat
		emission worker.EthereumAppFees
		err      error
	)

	switch transfer.Application {
	case ApplicationUniswapV2:
		fee, err = uniswap.GetUniswapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

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
	case ApplicationApeswap:
		fee, err = apeswap.GetApeswapFees(
			transfer,
			client,
			fluidTokenContract,
			tokenDecimals,
		)

		emission.Apeswap += util.MaybeRatToFloat(fee)

	default:
		err = fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}

	return fee, emission, err
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
	case ApplicationApeswap:
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

// ClassifyApplicationLogTopic returns a classification of which supported application
// a given topic corresponds to, if any
func ClassifyApplicationLogTopic(topic string) libApps.Application {
	switch topic {
	case UniswapSwapLogTopic:
		return ApplicationUniswapV2
	case OneInchLPV2SwapLogTopic:
		return ApplicationOneInchLPV2
	case OneInchLPV1SwapLogTopic:
		return ApplicationOneInchLPV1
	case MooniswapSwapLogTopic:
		return ApplicationMooniswap
	case OneInchFixedRateSwapLogTopic:
		return ApplicationOneInchFixedRateSwap
	case BalancerSwapLogTopic:
		return ApplicationBalancerV2
	case DodoV2DODOSwapLogTopic:
		return ApplicationDodoV2
	case CurveTokenExchangeLogTopic:
		return ApplicationCurve
	case MultichainLogAnySwapOut:
		return ApplicationMultichain
	case XyFinanceSourceChainSwap:
		return ApplicationXyFinance
	case ApeswapLogTopic:
		return ApplicationApeswap
	default:
		return ApplicationNone
	}
}
