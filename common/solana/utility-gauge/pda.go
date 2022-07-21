// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
