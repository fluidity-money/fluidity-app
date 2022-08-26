package prize_pool

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"strconv"

	"github.com/fluidity-money/fluidity-app/common/solana"
	"github.com/fluidity-money/fluidity-app/common/solana/pyth"

	"github.com/near/borsh-go"
)

// enum descriminant for the fluidity GetTVL instruction
// there's no associated data with it, so we just need this
const getTvlDiscriminant = uint8(4)

// data layout for the account that GetTVL writes its response into
type tvlDataAccount struct {
	Tvl uint64
}

// the solana-go sdk types this response incorrectly, leaving out the `value` field,
// so we inline our own response type here in order to let things decode correctly
type (
	simulateTransactionResponse struct {
		Value   SimulateTransactionValue `json:"value"`
		Context solana.Context                  `json:"context"`
	}

	SimulateTransactionValue struct {
		TransactionError interface{}                  `json:"err"`
		Logs             []string                     `json:"logs"`
		Accounts         []SimulateTransactionAccount `json:"accounts"`
		UnitsConsumed    uint64                       `json:"unitsConsumed"`
	}

	SimulateTransactionAccount struct {
		Lamports   uint64   `json:"lamports"`
		Owner      string   `json:"owner"`
		Data       []string `json:"data"` // this can be an object if we use JSON encoding in our request params
		Executable bool     `json:"executable"`
		RentEpoch  uint64   `json:"rentEpoch"`
	}
)

// GetMintSupply fetches the supply of a token via its mint address
func GetMintSupply(client *solana.SolanaRPCHandle, account solana.PublicKey) (uint64, error) {
	res, err := client.GetTokenSupply(
		account,
		"finalized",
	)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to get fluid token supply! %v",
			err,
		)
	}

	amountString := res.Value.Amount

	amount, err := strconv.ParseUint(amountString, 10, 64)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to parse token supply amount '%s': %v!",
			amountString,
			err,
		)
	}

	return amount, nil
}

// GetPrice wraps fetching the current price of a token
func GetPrice(client *solana.SolanaRPCHandle, account solana.PublicKey) (*big.Rat, error) {
	price, err := pyth.GetPrice(client, account)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to get the price using pyth: %v",
			err,
		)
	}

	return price, nil
}

// GetTvl retrieves the current total value locked from chain using a
// simulated transaction
func GetTvl(client *solana.SolanaRPCHandle, fluidityPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payer *solana.Wallet) (uint64, error) {

	params, err := getTvlTransactionParams(
		fluidityPubkey,
		tvlDataPubkey,
		solendPubkey,
		obligationPubkey,
		reservePubkey,
		pythPubkey,
		switchboardPubkey,
		payer,
	)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to get the tvl transaction params: %v",
			err,
		)
	}

	// solana-go had the response type wrong, so we manually call the method
	// and decode into our own response type

	response_json := client.RawInvoke(
		"simulateTransaction",
		params,
	)

	var response simulateTransactionResponse

	err = json.Unmarshal(response_json, response)

	if err != nil {
		return 0, fmt.Errorf(
			"Failed to simulate logtvl transaction! %v",
			err,
		)
	}

	value := response.Value

	if err := HandleTransactionError(value); err != nil {
		return 0, err
	}

	tvlAccount := new(tvlDataAccount)

	err = decodeAccountData(value.Accounts[0], tvlAccount)

	if err != nil {
		return 0, fmt.Errorf(
			"failed to decode account data: %v",
			err,
		)
	}

	return tvlAccount.Tvl, nil
}

// handleTransactionError to handle a TVL transaction error response
func HandleTransactionError(value SimulateTransactionValue) error {
	err := value.TransactionError
	if err == nil {
		return nil
	}

	// check switchboard 0x2a error with the condition
	// value.TransactionError["InstructionError"][1]["Custom"] == 42

	errMap, ok := value.TransactionError.(map[string]interface{})
	if !ok || errMap["InstructionError"] == nil {
		return logTvlError(err, value.Logs)
	}

	instructionErrors, ok := errMap["InstructionError"].([]interface{})
	if !ok || len(instructionErrors) < 2 {
		return logTvlError(err, value.Logs)
	}

	instructionErrMap, ok := instructionErrors[1].(map[string]interface{})
	if !ok {
		return logTvlError(err, value.Logs)
	}

	customError := instructionErrMap["Custom"]
	if customError == nil {
		return logTvlError(err, value.Logs)
	}

	errNum, ok := customError.(float64)
	if ok && errNum == 42 {
		return fmt.Errorf(
			"Failed to simulate logtvl transaction: stale oracle error 42!",
		)
	}

	return logTvlError(err, value.Logs)
}

// logTvlError for an unclassified TVL error where we display the logs
func logTvlError(err interface{}, logs []string) error {
	return fmt.Errorf(
		"Solana error simulating logtvl transaction! %v, logs: %v",
		err,
		logs,
	)
}

func decodeAccountData(data SimulateTransactionAccount, out interface{}) error {
	dataBase64 := data.Data[0]

	dataBinary, err := base64.StdEncoding.DecodeString(dataBase64)

	if err != nil {
		return fmt.Errorf(
			"failed to decode account data from base64: %v",
			err,
		)
	}

	err = borsh.Deserialize(out, dataBinary)

	if err != nil {
		return fmt.Errorf(
			"failed to decode tvl data: %v",
			err,
		)
	}

	return nil
}

func getTvlTransactionParams(fluidityPubkey, tvlDataPubkey, solendPubkey, obligationPubkey, reservePubkey, pythPubkey, switchboardPubkey solana.PublicKey, payerAccount *solana.Wallet) ([]interface{}, error) {
	accounts := solana.AccountMetaSlice{
		solana.NewAccountMeta(tvlDataPubkey, true, false),
		solana.NewAccountMeta(payerAccount.PublicKey(), false, false),
		solana.NewAccountMeta(solendPubkey, false, false),
		solana.NewAccountMeta(obligationPubkey, true, false),
		solana.NewAccountMeta(reservePubkey, true, false),
		solana.NewAccountMeta(pythPubkey, false, false),
		solana.NewAccountMeta(switchboardPubkey, false, false),
		solana.NewAccountMeta(solana.SysVarClockPubkey, false, false),
	}

	instruction := solana.NewInstruction(
		fluidityPubkey,
		accounts,
		[]byte{getTvlDiscriminant},
	)

	payer := solana.TransactionPayer(payerAccount.PublicKey())

	transaction, err := solana.NewTransaction(
		[]solana.Instruction{instruction},
		solana.Hash{},
		payer,
	)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to create logtvl transaction! %v",
			err,
		)
	}

	_, err = transaction.Sign(func(pk solana.PublicKey) *solana.PrivateKey {
		if payerAccount.PublicKey().Equals(pk) {
			return &payerAccount.PrivateKey
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to sign transaction! %v",
			err,
		)
	}

	transactionBinary, err := transaction.MarshalBinary()

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to marshal transaction! %v",
			err,
		)
	}

	transactionBase64 := base64.StdEncoding.EncodeToString(transactionBinary)

	opts := map[string]interface{}{
		"sigVerify":              false,
		"commitment":             "finalized",
		"encoding":               "base64",
		"replaceRecentBlockhash": true,
		"accounts": map[string]interface{}{
			"encoding": "base64",
			"addresses": []string{
				tvlDataPubkey.String(),
			},
		},
	}

	params := []interface{}{
		transactionBase64,
		opts,
	}

	return params, nil
}
