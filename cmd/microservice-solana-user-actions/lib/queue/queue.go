package queue

import (
	"time"

	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	"github.com/fluidity-money/fluidity-app/lib/types/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/winners"
)

const (
	// UsdcDecimals to use in lieu of loading this via an environment variable
	UsdcDecimals = 6

	// UsdcName to use to refer to the token
	UsdcName = "USDC"
)

func SendSwap(val uint64, hash string, by string, in bool) {
	swap := userAction.NewSwap(
		network.NetworkSolana,
		by,
		hash,
		misc.BigIntFromUint64(val),
		in,
		UsdcName,
		UsdcDecimals,
	)

	return swap
}

func NewTransfer(amount uint64, hash, adjustedFee *big.Rat, from, to, mintAuthority, pda string) *user_actions.UserAction {

	// token being minted or burnt - ignore

	if from == mintAuthority || to == mintAuthority || from == pda || to == pda {
		return nil
	}

	transfer := user_actions.NewSend(
		network.NetworkSolana,
		from,
		to,
		hash,
		misc.BigIntFromUint64(amount),
		UsdcName,
		UsdcDecimals,
	)

	transfer.AdjustedFee = adjustedFee

	return &transfer
}

func NewReward(amount uint64, hash, winnerA, winnerB string) (winners.Winner, winners.Winner) {

	reward := winners.Winner{
		Network:         network.NetworkSolana,
		TransactionHash: hash,
		WinningAmount:   misc.BigIntFromUint64(amount),
		AwardedTime:     time.Now(),
	}

	var (
		winnerSender   = reward
		winnerReceiver = reward
	)

	winnerSender.WinnerAddress = winnerA

	winnerReceiver.WinnerAddress = winnerB

	return winnerSender, winnerReceiver
}
