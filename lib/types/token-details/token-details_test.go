package token_details

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestTokenDetails(t *testing.T) {
	name := "fTEST"
	decimals := 6

	expectedDetails := TokenDetails{
		TokenShortName: name,
		TokenDecimals:  decimals,
	}

	details := New(name, decimals)

	assert.Equal(t, expectedDetails, details)
}
