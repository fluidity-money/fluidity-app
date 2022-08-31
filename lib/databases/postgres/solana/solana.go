// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

// solana contains database code to restrict the amount that can be minted

const (
	// Context is the context printed during logging
	Context = `POSTGRES/SOLANA`

	// TableUsers is used to implement mint limits for individual users
	TableUsers = `solana_users`
)
