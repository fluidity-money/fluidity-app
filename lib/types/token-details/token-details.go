// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package token_details

// TokenDetails is used to contain information on the underlying token and
// the number of decimal places in another structure.

// TokenDetails used to store information on the underlying token. When
// inserting this information into the database, should be expanded as-is
// and stored literally in the database.
type TokenDetails struct {
	TokenShortName string `json:"token_short_name"`
	TokenDecimals  int    `json:"token_decimals"`
}

// New TokenDetails, shortform to present data to any downstream
// consumers.
func New(shortName string, decimals int) TokenDetails {
	return TokenDetails{
		TokenShortName: shortName,
		TokenDecimals:  decimals,
	}
}
