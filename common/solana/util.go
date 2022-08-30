// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

// ripped (with changes) from https://github.com/gagliardetto/solana-go

package solana

import (
	"crypto"
	"crypto/ed25519"
	crypto_rand "crypto/rand"
	"errors"
	"fmt"
	"sort"

	"github.com/btcsuite/btcutil/base58"

	"filippo.io/edwards25519"
)

const (
	MaxSeeds      = 16
	MaxSeedLength = 32
)

const ProgramDerivedAddressMarker = "ProgramDerivedAddress"

type PrivateKey []byte

type Wallet struct {
	PrivateKey PrivateKey
}

type AccountMeta struct {
	PublicKey  PublicKey
	IsWritable bool
	IsSigner   bool
}

// Check if point exists on the ED25519 curve.
// Solana program addresses must not appear on curve.
func ValidCurve(point []byte) bool {
	_, err := new(edwards25519.Point).SetBytes(point)
	return err == nil
}

var ErrMaxSeedLengthExceeded = fmt.Errorf("max seed length exceeded")

// FindProgramAddress - just enough to cover the prior use case
func FindProgramAddress(seed [][]byte, pub PublicKey) (PublicKey, uint8, error) {
	// Iterator to gen nonces
	for i := 255; i > 0; i-- {
		address, err := CreateProgramAddress(append(seed, []byte{byte(i)}), pub)
		if err == nil {
			return address, uint8(i), nil
		}
	}
	return PublicKey{}, 0, fmt.Errorf("unable to find program address")
}

func WalletFromPrivateKeyBase58(b58 string) (*Wallet, error) {
	data := base58.Decode(b58)

	privateKeyLen := len(data)

	switch privateKeyLen {
	case 63:
		fallthrough

	case 64:

	default:
		return nil, fmt.Errorf(
			"private key was bad length, not 63 or 64, was %v!",
			privateKeyLen,
		)
	}

	return &Wallet{
		PrivateKey: data,
	}, nil
}

func NewAccountMeta(
	pubKey PublicKey,
	WRITE bool,
	SIGNER bool,
) *AccountMeta {
	return &AccountMeta{
		PublicKey:  pubKey,
		IsWritable: WRITE,
		IsSigner:   SIGNER,
	}
}

func (k PrivateKey) PublicKey() PublicKey {
	p := ed25519.PrivateKey(k)
	pub := p.Public().(ed25519.PublicKey)

	var publicKey PublicKey
	copy(publicKey[:], pub)

	return publicKey
}

func (w Wallet) PublicKey() PublicKey {
	return w.PrivateKey.PublicKey()
}

type AccountMetaSlice []*AccountMeta

type GenericInstruction struct {
	AccountValues AccountMetaSlice
	ProgID        PublicKey
	DataBytes     []byte
}

func NewInstruction(
	programID PublicKey,
	accounts AccountMetaSlice,
	data []byte,
) *GenericInstruction {
	return &GenericInstruction{
		AccountValues: accounts,
		ProgID:        programID,
		DataBytes:     data,
	}
}

// Requisite Types for NewTransaction
type Hash PublicKey // Alias

type MessageHeader struct {
	// The total number of signatures required to make the transaction valid.
	// The signatures must match the first `numRequiredSignatures` of `message.account_keys`.
	NumRequiredSignatures uint8 `json:"numRequiredSignatures"`

	// The last numReadonlySignedAccounts of the signed keys are read-only accounts.
	// Programs may process multiple transactions that load read-only accounts within
	// a single PoH entry, but are not permitted to credit or debit lamports or modify
	// account data.
	// Transactions targeting the same read-write account are evaluated sequentially.
	NumReadonlySignedAccounts uint8 `json:"numReadonlySignedAccounts"`

	// The last `numReadonlyUnsignedAccounts` of the unsigned keys are read-only accounts.
	NumReadonlyUnsignedAccounts uint8 `json:"numReadonlyUnsignedAccounts"`
}

type CompiledInstruction struct {
	// Index into the message.accountKeys array indicating the program account that executes this instruction.
	// NOTE: it is actually a uint8, but using a uint16 because uint8 is treated as a byte everywhere,
	// and that can be an issue.
	ProgramIDIndex uint16 `json:"programIdIndex"`

	// List of ordered indices into the message.accountKeys array indicating which accounts to pass to the program.
	// NOTE: it is actually a []uint8, but using a uint16 because []uint8 is treated as a []byte everywhere,
	// and that can be an issue.
	Accounts []uint16 `json:"accounts"`

	// The program input data encoded in a base-58 string.
	Data []byte `json:"data"`
}

type Message struct {
	// List of base-58 encoded public keys used by the transaction,
	// including by the instructions and for signatures.
	// The first `message.header.numRequiredSignatures` public keys must sign the transaction.
	AccountKeys []PublicKey `json:"accountKeys"`

	// Details the account types and signatures required by the transaction.
	Header MessageHeader `json:"header"`

	// A base-58 encoded hash of a recent block in the ledger used to
	// prevent transaction duplication and to give transactions lifetimes.
	RecentBlockhash Hash `json:"recentBlockhash"`

	// List of program instructions that will be executed in sequence
	// and committed in one atomic transaction if all succeed.
	Instructions []CompiledInstruction `json:"instructions"`
}

type Signature [64]byte

type Transaction struct {
	// A list of base-58 encoded signatures applied to the transaction.
	// The list is always of length `message.header.numRequiredSignatures` and not empty.
	// The signature at index `i` corresponds to the public key at index
	// `i` in `message.account_keys`. The first one is used as the transaction id.
	Signatures []Signature `json:"signatures"`

	// Defines the content of the transaction.
	Message Message `json:"message"`
}

type TransactionOption interface {
	apply(opts *transactionOptions)
}

type transactionOptions struct {
	payer PublicKey
}

type Instruction interface {
	ProgramID() PublicKey     // the programID the instruction acts on
	Accounts() []*AccountMeta // returns the list of accounts the instructions requires
	Data() ([]byte, error)    // the binary encoded instructions
}

func (in *GenericInstruction) ProgramID() PublicKey {
	return in.ProgID
}

func (in *GenericInstruction) Accounts() []*AccountMeta {
	return in.AccountValues
}

func (in *GenericInstruction) Data() ([]byte, error) {
	return in.DataBytes, nil
}

type PublicKeySlice []PublicKey

func (slice *PublicKeySlice) UniqueAppend(pubkey PublicKey) bool {
	if !slice.Has(pubkey) {
		slice.Append(pubkey)
		return true
	}
	return false
}

func (slice *PublicKeySlice) Append(pubkeys ...PublicKey) {
	*slice = append(*slice, pubkeys...)
}

func (slice PublicKeySlice) Has(pubkey PublicKey) bool {
	for _, key := range slice {
		if key.Equals(pubkey) {
			return true
		}
	}
	return false
}

func (a *AccountMeta) less(act *AccountMeta) bool {
	if a.IsSigner != act.IsSigner {
		return a.IsSigner
	}
	if a.IsWritable != act.IsWritable {
		return a.IsWritable
	}
	return false
}

// Pure clone of solana go code
func NewTransaction(instructions []Instruction, recentBlockHash Hash, opts ...TransactionOption) (*Transaction, error) {
	if len(instructions) == 0 {
		return nil, fmt.Errorf("requires at-least one instruction to create a transaction")
	}

	options := transactionOptions{}
	for _, opt := range opts {
		opt.apply(&options)
	}

	feePayer := options.payer
	if feePayer.IsZero() {
		found := false
		for _, act := range instructions[0].Accounts() {
			if act.IsSigner {
				feePayer = act.PublicKey
				found = true
				break
			}
		}
		if !found {
			return nil, fmt.Errorf("cannot determine fee payer. You can ether pass the fee payer via the 'TransactionWithInstructions' option parameter or it falls back to the first instruction's first signer")
		}
	}

	programIDs := make(PublicKeySlice, 0)
	accounts := []*AccountMeta{}
	for _, instruction := range instructions {
		for _, key := range instruction.Accounts() {
			accounts = append(accounts, key)
		}
		programIDs.UniqueAppend(instruction.ProgramID())
	}

	// Add programID to the account list
	for _, programID := range programIDs {
		accounts = append(accounts, &AccountMeta{
			PublicKey:  programID,
			IsSigner:   false,
			IsWritable: false,
		})
	}

	// Sort. Prioritizing first by signer, then by writable
	sort.SliceStable(accounts, func(i, j int) bool {
		return accounts[i].less(accounts[j])
	})

	uniqAccountsMap := map[PublicKey]uint64{}
	uniqAccounts := []*AccountMeta{}
	for _, acc := range accounts {
		if index, found := uniqAccountsMap[acc.PublicKey]; found {
			uniqAccounts[index].IsWritable = uniqAccounts[index].IsWritable || acc.IsWritable
			continue
		}
		uniqAccounts = append(uniqAccounts, acc)
		uniqAccountsMap[acc.PublicKey] = uint64(len(uniqAccounts) - 1)
	}

	// Move fee payer to the front
	feePayerIndex := -1
	for idx, acc := range uniqAccounts {
		if acc.PublicKey.Equals(feePayer) {
			feePayerIndex = idx
		}
	}

	accountCount := len(uniqAccounts)
	if feePayerIndex < 0 {
		// fee payer is not part of accounts we want to add it
		accountCount++
	}
	finalAccounts := make([]*AccountMeta, accountCount)

	itr := 1
	for idx, uniqAccount := range uniqAccounts {
		if idx == feePayerIndex {
			uniqAccount.IsSigner = true
			uniqAccount.IsWritable = true
			finalAccounts[0] = uniqAccount
			continue
		}
		finalAccounts[itr] = uniqAccount
		itr++
	}

	if feePayerIndex < 0 {
		// fee payer is not part of accounts we want to add it
		feePayerAccount := &AccountMeta{
			PublicKey:  feePayer,
			IsSigner:   true,
			IsWritable: true,
		}
		finalAccounts[0] = feePayerAccount
	}

	message := Message{
		RecentBlockhash: recentBlockHash,
	}
	accountKeyIndex := map[string]uint16{}
	for idx, acc := range finalAccounts {

		message.AccountKeys = append(message.AccountKeys, acc.PublicKey)
		accountKeyIndex[acc.PublicKey.String()] = uint16(idx)
		if acc.IsSigner {
			message.Header.NumRequiredSignatures++
			if !acc.IsWritable {
				message.Header.NumReadonlySignedAccounts++
			}
			continue
		}

		if !acc.IsWritable {
			message.Header.NumReadonlyUnsignedAccounts++
		}
	}

	for txIdx, instruction := range instructions {
		accounts = instruction.Accounts()
		accountIndex := make([]uint16, len(accounts))
		for idx, acc := range accounts {
			accountIndex[idx] = accountKeyIndex[acc.PublicKey.String()]
		}
		data, err := instruction.Data()
		if err != nil {
			return nil, fmt.Errorf("unable to encode instructions [%d]: %w", txIdx, err)
		}
		message.Instructions = append(message.Instructions, CompiledInstruction{
			ProgramIDIndex: accountKeyIndex[instruction.ProgramID().String()],
			Accounts:       accountIndex,
			Data:           data,
		})
	}

	return &Transaction{
		Message: message,
	}, nil
}

type privateKeyGetter func(key PublicKey) *PrivateKey

// Src: https://github.com/gagliardetto/binary/blob/master/compact-u16.go
func EncodeCompactU16Length(bytes *[]byte, ln int) {
	rem_len := ln
	for {
		elem := rem_len & 0x7f
		rem_len >>= 7
		if rem_len == 0 {
			*bytes = append(*bytes, byte(elem))
			break
		} else {
			elem |= 0x80
			*bytes = append(*bytes, byte(elem))
		}
	}
}

func (mx *Message) MarshalBinary() ([]byte, error) {
	buf := []byte{
		mx.Header.NumRequiredSignatures,
		mx.Header.NumReadonlySignedAccounts,
		mx.Header.NumReadonlyUnsignedAccounts,
	}

	EncodeCompactU16Length(&buf, len(mx.AccountKeys))
	for _, key := range mx.AccountKeys {
		buf = append(buf, key[:]...)
	}

	buf = append(buf, mx.RecentBlockhash[:]...)

	EncodeCompactU16Length(&buf, len(mx.Instructions))
	for _, instruction := range mx.Instructions {
		buf = append(buf, byte(instruction.ProgramIDIndex))
		EncodeCompactU16Length(&buf, len(instruction.Accounts))
		for _, accountIdx := range instruction.Accounts {
			buf = append(buf, byte(accountIdx))
		}

		EncodeCompactU16Length(&buf, len(instruction.Data))
		buf = append(buf, instruction.Data...)
	}
	return buf, nil
}

func (m *Message) signerKeys() []PublicKey {
	return m.AccountKeys[0:m.Header.NumRequiredSignatures]
}

func (k PrivateKey) Sign(payload []byte) (Signature, error) {
	p := ed25519.PrivateKey(k)
	signData, err := p.Sign(crypto_rand.Reader, payload, crypto.Hash(0))
	if err != nil {
		return Signature{}, err
	}

	var signature Signature
	copy(signature[:], signData)

	return signature, err
}

func (tx *Transaction) Sign(getter privateKeyGetter) (out []Signature, err error) {
	messageContent, err := tx.Message.MarshalBinary()
	if err != nil {
		return nil, fmt.Errorf("unable to encode message for signing: %w", err)
	}

	signerKeys := tx.Message.signerKeys()

	for _, key := range signerKeys {
		privateKey := getter(key)
		if privateKey == nil {
			return nil, fmt.Errorf("signer key %q not found. Ensure all the signer keys are in the vault", key.String())
		}

		s, err := privateKey.Sign(messageContent)
		if err != nil {
			return nil, fmt.Errorf("failed to signed with key %q: %w", key.String(), err)
		}

		tx.Signatures = append(tx.Signatures, s)
	}
	return tx.Signatures, nil
}

type transactionOptionFunc func(opts *transactionOptions)

func (f transactionOptionFunc) apply(opts *transactionOptions) {
	f(opts)
}

func TransactionPayer(payer PublicKey) TransactionOption {
	return transactionOptionFunc(func(opts *transactionOptions) { opts.payer = payer })
}

func (tx *Transaction) MarshalBinary() ([]byte, error) {
	if len(tx.Signatures) == 0 || len(tx.Signatures) != int(tx.Message.Header.NumRequiredSignatures) {
		return nil, errors.New("signature verification failed")
	}

	messageContent, err := tx.Message.MarshalBinary()
	if err != nil {
		return nil, fmt.Errorf("failed to encode tx.Message to binary: %w", err)
	}

	var signatureCount []byte
	EncodeCompactU16Length(&signatureCount, len(tx.Signatures))
	output := make([]byte, 0, len(signatureCount)+len(signatureCount)*64+len(messageContent))
	output = append(output, signatureCount...)
	for _, sig := range tx.Signatures {
		output = append(output, sig[:]...)
	}
	output = append(output, messageContent...)

	return output, nil
}
