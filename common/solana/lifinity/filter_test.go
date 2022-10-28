package lifinity

import (
	"testing"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/stretchr/testify/assert"
)

const lifinityProgramID = `EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S`

var testLogs = []string{
	`----- Correct swap, single fee -----`,
	`Program log: Instruction: LifinityTokenSwap`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S invoke [2]`,
	`Program log: Instruction: Swap`,
	`Program log: Oracle: {"a":3267841453,"b":3266990980}`,
	`Program log: Amount: {"in":12424372604,"out":405663653,"impact":0.11}`,
	`Program log: TotalFee: {"fee":9939498,"percent":0.08}`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]`,
	`Program log: Instruction: Transfer`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4736 of 351546 compute units`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]`,
	`Program log: Instruction: MintTo`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4492 of 322807 compute units`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]`,
	`Program log: Instruction: Transfer`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 315471 compute units`,
	`Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S consumed 108113 of 414732 compute units`,
	`----- Correct swap, single fee -----`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S invoke [2]`,
	`Program log: Instruction: Swap`,
	`Program log: Oracle: {"a":3531945781,"b":3518914244}`,
	`Program log: Amount: {"in":838860800,"out":23731446452,"impact":0.21}`,
	`Program log: TotalFee: {"fee":671088,"percent":0.08}`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S success`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S consumed 108113 of 414732 compute units`,
	`----- Different program ID, not added -----`,
	`Program whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc invoke [2]`,
	`Program log: Instruction: Swap`,
	`Program log: Oracle: {"a":3753143226,"b":3731054526}`,
	`Program log: Amount: {"in":5066135,"out":189987,"impact":0}`,
	`Program log: TotalFee: {"fee":4052,"percent":0.08}`,
	`Program whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc success`,
	`Program whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc consumed 108113 of 414732 compute units`,
	`----- Detects 2 fees within the same block -----`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S invoke [2]`,
	`Program log: Instruction: Swap`,
	`Program log: Oracle: {"a":3531104181,"b":3518513521}`,
	`Program log: Amount: {"in":1340000000,"out":47278884,"impact":0.02}`,
	`Program log: TotalFee: {"fee":1072000,"percent":0.08}`,
	`Program log: Instruction: Swap`,
	`Program log: Oracle: {"a":3532251479,"b":3518513521}`,
	`Program log: Amount: {"in":38071462072,"out":1343656672,"impact":0.71}`,
	`Program log: TotalFee: {"fee":30457169,"percent":0.08}`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S success`,
	`Program EewxydAPCCVuNEyrVN68PuSYdQ7wKn27V9Gjeoi8dy3S consumed 108113 of 414732 compute units`,
	`----- Complete -----`,
}

var expectedFees = []uint64{9939498, 671088, 1072000, 30457169}

func TestGetLogFees(t *testing.T) {

	logFees, err := GetLogFees(testLogs, lifinityProgramID, `TransactionSignature`)

	if err != nil {
		log.Debugf(
			"Lifinity test log parsing failed! %v",
			err,
		)
	}

	assert.Equal(t, expectedFees, logFees)

}

