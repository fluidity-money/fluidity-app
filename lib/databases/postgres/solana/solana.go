package solana

// solana contains database code to restrict the amount that can be minted

const (
	// Context is the context printed during logging
	Context = `POSTGRES/SOLANA`

	// TableUsers is used to implement mint limits for individual users
	TableUsers = `solana_users`
)
