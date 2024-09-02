package amm

import (
	"testing"
	"encoding/hex"

	"github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	"github.com/stretchr/testify/assert"
)

func TestDecodeUpdatePosition(t *testing.T) {
	b, err := hex.DecodeString("0000000000000000000000000000000000000000000000000dc051fbd4b4a1ca00000000000000000000000000000000000000000000000000000000d47a19cc")
	assert.Nil(t, err)
	u, err := DecodeUpdatePosition(ethereum.Log{
		Topics: []ethereum.Hash{
			ethereum.HashFromString("0x555c5816cc24ae6b4a85b2e02a07ebc514a04639a07694f29ff9a0de9b650987"),
			ethereum.HashFromString("0x0000000000000000000000000000000000000000000000000000000000000000"),
		},
		Data: misc.Blob(b),
	})
	assert.Nil(t, err)
	//assert.Equalf(t, misc.BigIntFromInt(0), u.Id, "id not equal")
	assert.Equalf(t, misc.BigIntFromInt64(990882060068757962), u.Token0, "token0 not equal")
	assert.Equalf(t, misc.BigIntFromInt64(3564771788), u.Token1, "token1 not equal")
}

func TestMintPosition(t *testing.T) {
	b, err := hex.DecodeString("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd00e4fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffd08a0")
	assert.Nil(t, err)
	m, err := DecodeMint(ethereum.Log{
		Topics: []ethereum.Hash{
			ethereum.HashFromString("0x7b0f5059c07211d90c2400fc99ac93e0e56db5168afa91f60d178bb6dc1c73f0"),
			ethereum.HashFromString("0x0000000000000000000000000000000000000000000000000000000000000000"),
			ethereum.HashFromString("0x000000000000000000000000feb6034fc7df27df18a3a6bad5fb94c0d3dcb6d5"),
			ethereum.HashFromString("0x00000000000000000000000022b9fa698b68bba071b513959794e9a47d19214c"),
		},
		Data: misc.Blob(b),
	})
	assert.Nil(t, err)
	//assert.Equalf(t, misc.BigIntFromInt(0), m.Id, "id not the same")
	assert.Equalf(t,
		ethereum.AddressFromString("0x22b9fa698b68bba071b513959794e9a47d19214c"),
		m.Pool,
		"pool not correct",
	)
}
