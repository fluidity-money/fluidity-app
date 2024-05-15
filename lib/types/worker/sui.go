package worker

import (
	"math/big"

	user_actions "github.com/fluidity-money/fluidity-app/lib/databases/timescale/user-actions"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/sui-go-sdk/models"
)

func NewSuiEmission() *Emission {
	emission := new(Emission)
	emission.Network = "sui"
	return emission
}

type SuiWorkerDecorator struct {
	// SuiAppFees for emissions
	SuiAppFees SuiAppFees `json:"sui_app_fees"`
	// optional utility corresponding to the application
	UtilityName applications.UtilityName `json:"utility_name"`
	// Application fee in USD
	ApplicationFee *big.Rat `json:"application_fee"`
	Volume         *big.Rat `json:"volume"`
}

type TransferWithFee struct {
	UserAction user_actions.UserAction
	Event      *models.SuiEventResponse
	Checkpoint misc.BigInt
	Decorator  *SuiWorkerDecorator
}
