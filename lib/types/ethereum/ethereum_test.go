package ethereum

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashFromString(t *testing.T) {
	str := "0xMixeDcAseString123"
	hash := HashFromString(str)

	assert.Equal(t, strings.ToLower(str), hash.String())
}

func TestAddressFromString(t *testing.T) {
	str := "0xMixeDcAseString123"
	address := AddressFromString(str)

	assert.Equal(t, strings.ToLower(str), address.String())
}
