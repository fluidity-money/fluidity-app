package ethereum

import (
	"math/big"

	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
)

// ConvertHeader from the ethereum definition into its internal type
// equivalent
func ConvertHeader(oldHeader *ethTypes.Header) types.BlockHeader {

	var difficulty, number, baseFee big.Int

	if difficulty_ := oldHeader.Difficulty; difficulty_ != nil {
		difficulty = *difficulty_
	}

	if number_ := oldHeader.Number; number_ != nil {
		number = *number_
	}

	if baseFee_ := oldHeader.BaseFee; baseFee_ != nil {
		baseFee = *baseFee_
	}

	receiptHash := oldHeader.ReceiptHash.Hex()

	return types.BlockHeader{
		BlockHash:       types.HashFromString(oldHeader.Hash().Hex()),
		ParentHash:      types.HashFromString(oldHeader.ParentHash.Hex()),
		UncleHash:       types.HashFromString(oldHeader.UncleHash.Hex()),
		Coinbase:        types.AddressFromString(oldHeader.Coinbase.Hex()),
		Root:            types.HashFromString(oldHeader.Root.Hex()),
		TransactionHash: types.HashFromString(oldHeader.TxHash.Hex()),
		Bloom:           oldHeader.Bloom.Bytes(),
		Difficulty:      misc.NewBigInt(difficulty),
		Number:          misc.NewBigInt(number),
		GasLimit:        misc.BigIntFromUint64(oldHeader.GasLimit),
		GasUsed:         misc.BigIntFromUint64(oldHeader.GasUsed),
		Time:            oldHeader.Time,
		Extra:           oldHeader.Extra,
		MixDigest:       types.HashFromString(oldHeader.MixDigest.Hex()),
		Nonce:           types.BlockNonce(oldHeader.Nonce[:]),
		ReceiptHash:     types.HashFromString(receiptHash),
		BaseFee:         misc.NewBigInt(baseFee),
	}
}
