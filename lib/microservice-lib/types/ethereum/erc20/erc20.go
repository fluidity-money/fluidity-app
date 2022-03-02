package erc20

// erc20 implements some of the ERC20 methods with extra information baked in

import (
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"time"
)

// Transfer made using a ERC20 contract
type Transfer struct {
	ContractAddress ethereum.Address `json:"contract_address"`
	FromAddress     ethereum.Address `json:"from_address"`
	ToAddress       ethereum.Address `json:"to_address"`
	Amount          misc.BigInt      `json:"amount"`

	// PickedUp is when we processed this event
	PickedUp        time.Time        `json:"time"`

	TransactionHash ethereum.Hash    `json:"transaction_hash"`
}
