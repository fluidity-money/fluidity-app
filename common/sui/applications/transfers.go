package applications

import (
	"fmt"

	"github.com/fluidity-money/sui-go-sdk/models"
	"github.com/fluidity-money/fluidity-app/lib/queues/sui"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
)

// ClassifyApplicationTransfer to determine the application used in a transfer based on the event type
func ClassifyApplicationTransfer(event models.SuiEventResponse) Application {
	switch event.Type {
	default:
		return ApplicationNone
	}
}

// currently passes the entire block since no apps are currently implemented
// GetApplicationFee to find the fee (in USD) paid by a user for the application interaction
// returns (feeData with Fee set to nil, nil) in the case where the application event is legitimate, but doesn't involve
// the fluid asset we're tracking, e.g. in a multi-token pool where two other tokens are swapped
// if a receipt is passed, will be passed to the application if it can use it
func GetApplicationFee(transfer sui.DecoratedTransfer, event models.SuiEventResponse, application Application) (applications.ApplicationFeeData, applications.ApplicationData, sui.SuiAppFees, error) {
	var (
		feeData  applications.ApplicationFeeData
		appData  applications.ApplicationData
		emission sui.SuiAppFees
		err      error
	)

	switch application {
	case ApplicationNone:
		return feeData, appData, emission, nil
	}

	return feeData, appData, emission, err
}

// GetApplicationTransferParties to find the parties considered for payout from an application interaction.
// In the case of an AMM (such as Uniswap) the transaction sender receives the majority payout every time,
// with the recipient tokens being effectively burnt (sent to the contract). In the case of a P2P swap,
// such as a DEX, the party sending the fluid tokens receives the majority payout.
func GetApplicationTransferParties(transfer sui.DecoratedTransfer, application Application) (string, string, error) {
	switch application {
	default:
		return "", "", fmt.Errorf(
			"Transfer #%v did not contain an application",
			transfer,
		)
	}
}
