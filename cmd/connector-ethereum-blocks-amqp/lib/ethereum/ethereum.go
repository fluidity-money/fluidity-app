package ethereum

// ethereum contains code that converts Ethereum's definition of datatypes
// to our internal representation

import (
	"fmt"
	"math/big"

	ethTypes "github.com/ethereum/go-ethereum/core/types"

	types "github.com/fluidity-money/fluidity-app/lib/types/ethereum"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
)

// emptyAddress to use when a transaction doesn't have a recipient
const emptyAddress = `0x0000000000000000000000000000000000000000`

// ConvertTransaction from Ethereum's definition to our internal one
func ConvertTransaction(blockHash string, oldTransaction *ethTypes.Transaction) (*types.Transaction, error) {
	chainId_ := oldTransaction.ChainId()

	// convert to message to obtain sender address

	signer := ethTypes.NewLondonSigner(chainId_)

	transactionMessage, err := oldTransaction.AsMessage(signer, nil)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get a transaction signer! %v",
			err,
		)
	}

	var (
		chainId   big.Int
		cost      big.Int
		gasPrice  big.Int
		to        string
		gasFeeCap big.Int
		gasTipCap big.Int
		value     big.Int
	)

	if chainId_ != nil {
		chainId = *chainId_
	}

	if cost_ := oldTransaction.Cost(); cost_ != nil {
		cost = *cost_
	}

	if gasPrice_ := oldTransaction.GasPrice(); gasPrice_ != nil {
		gasPrice = *gasPrice_
	}

	if to_ := oldTransaction.To(); to_ != nil {
		to = to_.Hex()
	} else {
		to = emptyAddress
	}

	if gasTipCap_ := oldTransaction.GasTipCap(); gasTipCap_ != nil {
		gasTipCap = *gasTipCap_
	}

	if gasFeeCap_ := oldTransaction.GasFeeCap(); gasFeeCap_ != nil {
		gasFeeCap = *gasFeeCap_
	}

	if value_ := oldTransaction.Value(); value_ != nil {
		value = *value_
	}

	newTransaction := types.Transaction{
		BlockHash: types.HashFromString(blockHash),
		ChainId:   misc.NewBigInt(chainId),
		Cost:      misc.NewBigInt(cost),
		Data:      oldTransaction.Data(),
		Gas:       oldTransaction.Gas(),
		GasFeeCap: misc.NewBigInt(gasFeeCap),
		GasTipCap: misc.NewBigInt(gasTipCap),
		GasPrice:  misc.NewBigInt(gasPrice),
		Hash:      types.HashFromString(oldTransaction.Hash().Hex()),
		Nonce:     oldTransaction.Nonce(),
		To:        types.AddressFromString(to),
		From:      types.AddressFromString(transactionMessage.From().Hex()),
		Type:      oldTransaction.Type(),
		Value:     misc.NewBigInt(value),
	}

	return &newTransaction, nil
}

// ConvertTransactions into their new type definition equivalent
func ConvertTransactions(blockHash string, oldTransactions []*ethTypes.Transaction) ([]types.Transaction, error) {
	newTransactions := make([]types.Transaction, len(oldTransactions))

	for i, txn := range oldTransactions {
		transaction, err := ConvertTransaction(blockHash, txn)

		if err != nil {
			return nil, err
		}

		newTransactions[i] = *transaction
	}

	return newTransactions, nil
}

func ConvertTransactionReceipt(oldReceipt *ethTypes.Receipt) types.Receipt {
	oldLogs := oldReceipt.Logs

	logs := make([]types.Log, len(oldLogs))

	for i, log := range oldLogs {
		logs[i] = ConvertLog(log)
	}

	bloom := []byte(oldReceipt.Bloom[:])

	return types.Receipt{
		Type:              oldReceipt.Type,
		PostState:         misc.Blob(oldReceipt.PostState),
		Status:            oldReceipt.Status,
		CumulativeGasUsed: oldReceipt.CumulativeGasUsed,
		Bloom:             misc.Blob(bloom),
		Logs:              logs,
		TransactionHash:   types.HashFromString(oldReceipt.TxHash.Hex()),
		ContractAddress:   types.AddressFromString(oldReceipt.ContractAddress.Hex()),
		GasUsed:           misc.BigIntFromUint64(oldReceipt.GasUsed),
		BlockHash:         types.HashFromString(oldReceipt.BlockHash.Hex()),
		BlockNumber:       misc.NewBigInt(*oldReceipt.BlockNumber),
		TransactionIndex:  oldReceipt.TransactionIndex,
	}
}

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

// NewHeaders creates a list of queueable headers from a list of regular ethereum block headers
func NewHeaders(oldHeaders []*ethTypes.Header) []types.BlockHeader {
	newHeaders := make([]types.BlockHeader, len(oldHeaders))

	for i, oldHeader := range oldHeaders {
		var (
			difficulty big.Int
			number     big.Int
			baseFee    big.Int
		)

		if difficulty_ := oldHeader.Difficulty; difficulty_ != nil {
			difficulty = *difficulty_
		}

		if number_ := oldHeader.Number; number_ != nil {
			number = *number_
		}
		if baseFee_ := oldHeader.BaseFee; baseFee_ != nil {
			baseFee = *oldHeader.BaseFee
		}

		blockHeader := types.BlockHeader{
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
			ReceiptHash:     types.HashFromString(oldHeader.ReceiptHash.Hex()),
			BaseFee:         misc.NewBigInt(baseFee),
		}

		newHeaders[i] = blockHeader
	}

	return newHeaders
}

// ConvertBody converts the body from the ethereum types into our internal
// definition
func ConvertBlockBody(blockHash string, body *ethTypes.Body) (*types.BlockBody, error) {
	newTransactions, err := ConvertTransactions(
		blockHash,
		body.Transactions,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed convert the transactions inside a block! %v",
			err,
		)
	}

	uncles := NewHeaders(body.Uncles)

	newBody := types.BlockBody{
		Uncles:       uncles,
		Transactions: newTransactions,
	}

	return &newBody, nil
}

// ConvertBlock creates a queueable block from a regular ethereum block
func ConvertBlock(block *ethTypes.Block) (*types.Block, error) {
	var (
		newHeader    = ConvertHeader(block.Header())
		blockHashHex = block.Hash().Hex()
	)

	newBody, err := ConvertBlockBody(
		blockHashHex,
		block.Body(),
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to convert block! %v",
			err,
		)
	}

	newBlock := types.Block{
		Header: newHeader,
		Body:   *newBody,
		Hash:   types.HashFromString(blockHashHex),
		Number: block.NumberU64(),
	}

	return &newBlock, nil
}

func ConvertLog(log *ethTypes.Log) types.Log {
	topics := make([]types.Hash, len(log.Topics))

	for i, topic := range log.Topics {
		topics[i] = types.HashFromString(topic.Hex())
	}

	return types.Log{
		Address:     types.AddressFromString(log.Address.Hex()),
		Topics:      topics,
		Data:        log.Data,
		BlockNumber: log.BlockNumber,
		TxHash:      types.HashFromString(log.TxHash.Hex()),
		TxIndex:     log.TxIndex,
		BlockHash:   types.HashFromString(log.BlockHash.Hex()),
		Index:       log.Index,
		Removed:     log.Removed,
	}
}
