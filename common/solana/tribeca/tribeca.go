package tribeca

import solana "github.com/gagliardetto/solana-go"

type (
	TribecaProgramData struct {
		Authority solana.PublicKey
		Delta     uint8
		M         uint8
		FreqDiv   uint8
		Bump      uint8
	}
)
