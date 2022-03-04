package fluidity

import (
	"context"
	"fmt"

	"github.com/fluidity-money/fluidity-app/lib/log"

	solana "github.com/gagliardetto/solana-go"
	solanaRpc "github.com/gagliardetto/solana-go/rpc"
	"github.com/near/borsh-go"
)

const (
	// VariantPayout to use when making payouts
	VariantPayout = 2

	// VariantSendAmount to use when submitting transfers in the contract
	VariantSendAmount = 3
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

	// InstructionTransfer used when making transfers of the token
	InstructionTransfer struct {
		Variant uint8
		Amount uint64
	}
)

// SendTransfer using the token address given, the sender address, returning
// the signature or an error. Derives the user's program address, then creates
// a new ATA if the address doesn't exist!
func SendTransfer(solanaClient *solanaRpc.Client, tokenProgramAddressPublicKey, tokenAssociatedProgramAddressPublicKey, senderAddress, recipientAddress, tokenAddress solana.PublicKey, amount uint64, recentBlockHash solana.Hash, publicKey solana.PublicKey, privateKey solana.PrivateKey) (string, error) {

	var (
		senderAccountMeta = solana.NewAccountMeta(senderAddress, true, false)
		signerAccountMeta = solana.NewAccountMeta(publicKey, true, true)
		tokenAddressMeta  = solana.NewAccountMeta(tokenAddress, true, false)
	)

	programAddressInput := [][]byte{
		recipientAddress[:],
		tokenProgramAddressPublicKey[:],
		tokenAddress[:],
	}

	ataRecipientPublicKey, _, err := solana.FindProgramAddress(
		programAddressInput,
		tokenAssociatedProgramAddressPublicKey,
	)

	log.App(func(k *log.Log) {
		address := base58PublicKey(ataRecipientPublicKey)

		k.Format(
			"About to send an amount to the key %v!",
			address,
		)
	})

	if err != nil {
		return "", fmt.Errorf(
			"unable to derive the user's ATA key! %v",
			err,
		)
	}
	recipientAccountMeta := solana.NewAccountMeta(ataRecipientPublicKey, true, false)

	_, err = solanaClient.GetAccountInfo(context.Background(), ataRecipientPublicKey)

	var instructions []solana.Instruction

	if err != nil {
		createAccountSlice := solana.AccountMetaSlice{
			signerAccountMeta,
			recipientAccountMeta,
			solana.NewAccountMeta(recipientAddress, true, false),
			tokenAddressMeta,
			solana.NewAccountMeta(solana.SystemProgramID, false, false),
			solana.NewAccountMeta(tokenProgramAddressPublicKey, false, false),
			solana.NewAccountMeta(solana.SysVarRentPubkey, false, false),
		}

		createAccountInstruction := solana.NewInstruction(
			tokenAssociatedProgramAddressPublicKey,
			createAccountSlice,
			[]byte{},
		)

		instructions = append(instructions, createAccountInstruction)
	}

	accountMetaSlice := solana.AccountMetaSlice{
		senderAccountMeta,
		recipientAccountMeta,
		signerAccountMeta,
		tokenAddressMeta,
	}

	data := InstructionTransfer{
		Variant:    VariantSendAmount,
		Amount: amount,
	}

	dataSerialised, err := borsh.Serialize(data)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to serialise the data content to send out! %v",
			err,
		)
	}

	transferInstruction := solana.NewInstruction(
		tokenProgramAddressPublicKey,
		accountMetaSlice,
		dataSerialised,
	)

	instructions = append(instructions, transferInstruction)

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
