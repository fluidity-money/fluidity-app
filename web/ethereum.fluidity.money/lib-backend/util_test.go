package api_fluidity_money

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAddressRequestToEthereumAddress(t *testing.T) {
	address := addressRequestToEthereumAddress("0xabc")
	assert.EqualValues(t, "abc", address)

	address = addressRequestToEthereumAddress("0xAbCDeF")
	assert.EqualValues(t, "abcdef", address)

	address = addressRequestToEthereumAddress("")
	assert.EqualValues(t, "", address)

	address = addressRequestToEthereumAddress("AbC")
	assert.EqualValues(t, "abc", address)

	address = addressRequestToEthereumAddress("AbCDeF")
	assert.EqualValues(t, "abcdef", address)
}
