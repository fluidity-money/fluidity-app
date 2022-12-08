package spooler

import (
	"database/sql"
	"fmt"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)


func TestNewPendingWinnersHandler(t *testing.T) {
	var client *sql.DB
	handler := NewPendingWinnersHandler(client)
	assert.Nil(t, handler.client)

	db, _, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	client = db
	handler = NewPendingWinnersHandler(client)

	assert.Equal(t, db, client)
}

// Cannot test failure case due to log.Fatal
func TestInsertPendingWinners(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	defer db.Close()

	queryString := fmt.Sprintf("INSERT INTO %s", TablePendingWinners)

	var (
		fromWinAmount = misc.BigIntFromInt64(5)
		toWinAmount   = misc.BigIntFromInt64(20)
		blockNumber   = misc.BigIntFromInt64(15)
	)

	mock.ExpectExec(queryString).WithArgs(
		"USDC",
		6,
		"0xhash",
		"0xfromaddr",
		&fromWinAmount,
		&blockNumber,
		"ethereum",
		"send",
	).WillReturnResult(sqlmock.NewResult(0, 1))

	mock.ExpectExec(queryString).WithArgs(
		"USDC",
		6,
		"0xhash",
		"0xtoaddr",
		&toWinAmount,
		&blockNumber,
		"ethereum",
		"receive",
	).WillReturnResult(sqlmock.NewResult(0, 1))

	client := NewPendingWinnersHandler(db)

	winner := worker.EthereumWinnerAnnouncement{
		"ethereum",
		ethereum.HashFromString("0xhash"),
		&blockNumber,
		ethereum.AddressFromString("0xfromaddr"),
		ethereum.AddressFromString("0xtoaddr"),
		&fromWinAmount,
		&toWinAmount,
		token_details.New("USDC", 6),
		applications.Application(0),
	}

	client.InsertPendingWinners(winner)

	err = mock.ExpectationsWereMet()
	require.NoError(t, err)
}
