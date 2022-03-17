package fluidity

import (
	"fmt"
	"context"

	"github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"

	"github.com/near/borsh-go"
)

const (
	// VariantPayout used when rewarding a user
	VariantPayout = 2

	// VariantTransfer used when transferring an amount to a user
	VariantTransfer = 3
)

type (
	// InstructionPayout that should be serialised using Borsh to call the
	// contract to payout a winner
	InstructionPayout struct {
		Variant   uint8
		Amount    uint64
		TokenName string
		BumpSeed  uint8
	}

	// InstructionTransfer generally used with VariantTransfer to send amounts
	InstructionTransfer struct {
		Variant uint8
		Amount  uint64
	}
)

// SendTransfer using the token address given, the sender address, returning
// the signature or an error
func SendTransfer(solanaClient *solanaRpc.Client, senderAddress, recipientAddress, tokenAddress solana.PublicKey, amount uint64, recentBlockHash solana.Hash, publicKey solana.PublicKey, privateKey solana.PrivateKey) (string, error) {
	var (
		senderAccountMeta    = solana.NewAccountMeta(senderAddress, false, true)
		recipientAddressMeta = solana.NewAccountMeta(recipientAddress, true, false)
		tokenAddressMeta     = solana.NewAccountMeta(tokenAddress, true, false)
	)

	accountMetaSlice := solana.AccountMetaSlice{
		senderAccountMeta,
		recipientAddressMeta,
		tokenAddressMeta,
	}

	transferData := InstructionTransfer{
		Variant: VariantTransfer,
		Amount:  amount,
	}

	dataSerialised, err := borsh.Serialize(transferData)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to serialise the data content to send out! %v",
			err,
		)
	}

	instruction := solana.NewInstruction(
		tokenAddress,
		accountMetaSlice,
		dataSerialised,
	)

	instructions := []solana.Instruction{instruction}

	transaction, err := solana.NewTransaction(instructions, recentBlockHash)

	if err != nil {
		return "", fmt.Errorf(
			"failed to make a new transaction with the instructions given and the block hash! %v",
			err,
		)
	}

	_, err = transaction.Sign(func(publicKey_ solana.PublicKey) *solana.PrivateKey {

		if publicKey.Equals(publicKey_) {
			return &privateKey
		}

		return nil
	})

	if err != nil {
		return "", fmt.Errorf(
			"failed to sign the transaction using the user's private key! %v",
			err,
		)
	}

	signature, err := solanaClient.SendTransaction(context.Background(), transaction)

	if err != nil {
		return "", fmt.Errorf(
			"failed to send the transaction to Solana! %v",
			err,
		)
	}

	signatureString := fmt.Sprintf("%x", string(signature[:]))

	return signatureString, nil
}
