package spooler

import (
	"database/sql"
	"fmt"
	"math/big"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/DATA-DOG/go-txdb"
	"github.com/fluidity-money/fluidity-app/lib/types/applications"
	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/network"
	token_details "github.com/fluidity-money/fluidity-app/lib/types/token-details"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	_ "github.com/lib/pq"
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

func init() {
	txdb.Register("txdb", "postgres", "postgresql://fluidity:fluidity@localhost:5433?sslmode=disable")
}

const pendingWinnersInsert = `INSERT INTO ethereum_pending_winners
(
	token_short_name,
	token_decimals,
	transaction_hash,
	address,
	win_amount,
	block_number,
	reward_sent,
	network,
	inserted_date,
	reward_type
)
VALUES (
	'USDC',
	6,
	'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	'0xabc1160380dD99FD648a43a97b23E9aE9c65878A',
	1500000,
	15,
	false,
	'ethereum',
	'2022-05-08',
	'receive'	
),
(
	'USDC',
	6,
	'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
	'0xdef3ed95fA5b7EB62331372Cc03f0DF513a77c4c',
	800000,
	15,
	false,
	'ethereum',
	'2022-05-08',
	'send'	
),
(
	'USDT',
	6,
	'6c98565697da2dbf2fc08970eb06242a785fe708cc8b0415026e100f5ae260d2',
	'0xabc1160380dD99FD648a43a97b23E9aE9c65878A',
	12500,
	15,
	true,
	'ethereum',
	'2022-05-08',
	'receive'	
),
(
	'USDT',
	6,
	'6c98565697da2dbf2fc08970eb06242a785fe708cc8b0415026e100f5ae260d2',
	'0xdef3ed95fA5b7EB62331372Cc03f0DF513a77c4c',
	150,
	15,
	false,
	'ethereum',
	'2022-05-08',
	'send'	
);`

func TestUnpaidWinningsForTokenIntegration(t *testing.T) {
	t.Parallel()
	if testing.Short() {
		t.Skip("testing.Short() - skipping integration test")
	}

	db, err := sql.Open("txdb", "unpaidWinningsForToken")
	require.NoError(t, err)

	_, err = db.Exec(pendingWinnersInsert)
	require.NoError(t, err)

	defer db.Close()
	
	handler := NewPendingWinnersHandler(db)

	tokenDetails := token_details.New("USDC", 6)
	winnings := handler.UnpaidWinningsForToken(network.NetworkEthereum, tokenDetails)
	expectedWinnings := big.NewInt(2300000)
	assert.Equal(t, expectedWinnings, winnings)

	tokenDetails.TokenShortName = "USDT"
	winnings = handler.UnpaidWinningsForToken(network.NetworkEthereum, tokenDetails)
	expectedWinnings = big.NewInt(150)
	assert.Equal(t, expectedWinnings, winnings)
}
