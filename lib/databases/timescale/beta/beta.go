package beta

const (
	// Context to use when logging
	Context = `TIMESCALE/BETA`

	// TableBetaTransactions to use for transactions made during the beta
	TableBetaTransactions = `beta_transactions`

	// TableBetaWinningTransactions to use for beta winning transactions
	TableBetaWinningTransactions = `beta_winning_transactions`

	// TableBetaCompletedQuests to use for quests that were completed
	TableBetaCompletedQuests = `beta_completed_quests`

	// TableBetaWinLogs to use for payout amounts from the random worker
	TableBetaWinLogs = `beta_win_logs`
)
