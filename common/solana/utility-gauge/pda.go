package utility_gauge

import (
	solana "github.com/gagliardetto/solana-go"
)

func DeriveGaugePubkey(gaugemeister, protocol solana.PublicKey) (solana.PublicKey, uint8, error) {
	var (
		gaugeString = "Gauge"
		gaugeBytes_ = []byte(gaugeString)
		gaugeBytes  = [][]byte(gaugeBytes_)
	)

	gaugePda, gaugePdaBump, err := solana.FindProgramAddress(
		gaugeBytes,
		gaugemeister,
		protocol,
	)

	return gaugePda, gaugePdaBump, err
}

func DeriveEpochGaugePubkey(gauge solana.PublicKey, epoch uint32) (solana.PublicKey, uint8, error) {
	var (
		epochGaugeString = "EpochGauge"
		epochGaugeBytes_ = []byte(gaugeString)
		epochGaugeBytes  = [][]byte(gaugeBytes_)

		epochBytes = []byte(epoch)
	)

	epcohGaugePda, epcohGaugePdaBump, err := solana.FindProgramAddress(
		epochGaugeBytes,
		gauge,
		epochBytes,
	)

	return gaugePda, gaugePdaBump, err
}
