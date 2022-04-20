package fluidity

import (
	"context"
	"fmt"

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

const (
	// TokenProgramAddress to use as the SPL token
	TokenProgramAddress = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"

	// TokenAssociatedProgramAddress used to create accounts
	TokenAssociatedProgramAddress = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
)

var (
	// TokenProgramAddressPubkey
	TokenProgramAddressPubkey = solana.MustPublicKeyFromBase58(TokenProgramAddress)

	// TokenAssociatedProgramAddressPubkey
	TokenAssociatedProgramAddressPubkey = solana.MustPublicKeyFromBase58(
		TokenAssociatedProgramAddress,
	)
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
func SendTransfer(solanaClient *solanaRpc.Client, senderAddress, recipientAddress, tokenMintAddress solana.PublicKey, amount uint64, recentBlockHash solana.Hash, publicKey solana.PublicKey, privateKey solana.PrivateKey) (string, error) {

	var (
		senderAccountMeta = solana.NewAccountMeta(senderAddress, true, false)
		signerAccountMeta = solana.NewAccountMeta(publicKey, true, true)
		tokenMintMeta  = solana.NewAccountMeta(tokenMintAddress, true, false)
	)

	programAddressInput := [][]byte{
		recipientAddress[:],
		TokenProgramAddressPubkey[:],
		tokenMintAddress[:],
	}

	ataRecipientPublicKey, _, err := solana.FindProgramAddress(
		programAddressInput,
		TokenAssociatedProgramAddressPubkey,
	)

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
			solana.NewAccountMeta(recipientAddress, false, false),
			tokenMintMeta,
			solana.NewAccountMeta(solana.SystemProgramID, false, false),
			solana.NewAccountMeta(TokenProgramAddressPubkey, false, false),
			solana.NewAccountMeta(solana.SysVarRentPubkey, false, false),
		}

		createAccountInstruction := solana.NewInstruction(
			TokenAssociatedProgramAddressPubkey,
			createAccountSlice,
			[]byte{},
		)

		instructions = append(instructions, createAccountInstruction)
	}

	accountMetaSlice := solana.AccountMetaSlice{
		senderAccountMeta,
		recipientAccountMeta,
		signerAccountMeta,
	}

	data := InstructionTransfer{
		Variant: VariantTransfer,
		Amount:  amount,
	}

	dataSerialised, err := borsh.Serialize(data)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to serialise the data content to send out! %v",
			err,
		)
	}

	transferInstruction := solana.NewInstruction(
		TokenProgramAddressPubkey,
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

// Hardcoded fluid->base token pairs
func GetBaseToken(token string) (string, error) {
	fluidTokens := map[string]string{
		"2XGVdHsAiMM9QDM9tV4fwQ2JnyWdSJaiXp2KifLJD1oa": "zVzi5VAf4qMEwzv7NXECVx5v2pQ7xnqVVjCXZwS9XzA",
		"97JpYk6S7i9ydzjNwb92DQEfsA1KUUWSwnWGaGDFe6bk": "Bp2nLuamFZndE7gztA1iPsNVhdJeg9xfKdq7KmvjpGoP",
	}
	baseToken := fluidTokens[token]
	if baseToken == "" {
		return "", fmt.Errorf("Token not found!")
	}

	return baseToken, nil
}

func IsFluidToken(token string) (bool) {
	_, err := GetBaseToken(token)
	if err != nil {
		return true
	}
	return false
}
