package ethereum

// ethereum contains database code to use when talking to the

const (
	// Context is the context printed during logging
	Context = `POSTGRES/ETHEREUM`

	// TableLogs is used with the SQL database to read and write logs
	TableLogs = `ethereum_logs`

	// TableTransactions is used to store and read transactions
	TableTransactions = `ethereum_transactions`
)
