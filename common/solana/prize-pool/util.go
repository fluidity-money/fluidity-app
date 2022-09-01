// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package prize_pool

import (
	"fmt"

	"github.com/fluidity-money/fluidity-app/common/solana/rpc"
)

// handleTransactionError to handle a TVL transaction error response
func handleTransactionError(value *rpc.SimulationValue) error {
	if value == nil {
		return nil
	}

	err := value.TransactionError
	if err == nil {
		return nil
	}

	// check switchboard 0x2a error with the condition
	// value.TransactionError["InstructionError"][1]["Custom"] == 42

	errMap, ok := (*err).(map[string]interface{})
	if !ok || errMap["InstructionError"] == nil {
		return logTvlError(err, value.Logs)
	}

	instructionErrors, ok := errMap["InstructionError"].([]interface{})
	if !ok || len(instructionErrors) < 2 {
		return logTvlError(err, value.Logs)
	}

	instructionErrMap, ok := instructionErrors[1].(map[string]interface{})
	if !ok {
		return logTvlError(err, value.Logs)
	}

	customError := instructionErrMap["Custom"]
	if customError == nil {
		return logTvlError(err, value.Logs)
	}

	errNum, ok := customError.(float64)
	if ok && errNum == 42 {
		return fmt.Errorf(
			"Failed to simulate logtvl transaction: stale oracle error 42!",
		)
	}

	return logTvlError(err, value.Logs)
}

// logTvlError for an unclassified TVL error where we display the logs
func logTvlError(err interface{}, logs []string) error {
	return fmt.Errorf(
		"Solana error simulating logtvl transaction! %v, logs: %v",
		err,
		logs,
	)
}
