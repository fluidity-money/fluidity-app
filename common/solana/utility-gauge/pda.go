package utility_gauge

import (
	"encoding/binary"

	solana "github.com/gagliardetto/solana-go"
)

func DeriveEpochGaugePubkey(program, gauge solana.PublicKey, epoch uint32) (solana.PublicKey, uint8, error) {
	var (
		epochGaugeString      = "EpochGauge"
		epochGaugeStringBytes = []byte(epochGaugeString)

		gaugeBytes = gauge.Bytes()

		epochBytes = make([]byte, 4)
	)

	binary.LittleEndian.PutUint32(epochBytes, epoch)

	epochGaugeSeed := [][]byte{epochGaugeStringBytes, gaugeBytes, epochBytes}

	epochGaugePda, epochGaugePdaBump, err := solana.FindProgramAddress(
		epochGaugeSeed,
		program,
	)

	return epochGaugePda, epochGaugePdaBump, err
}
