// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package solana

import (
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"

	"github.com/btcsuite/btcutil/base58"
)

type PublicKey [32]byte

// PublicKeyFromBase58 using btcsuite
func PublicKeyFromBase58(b58 string) (PublicKey, error) {
	key := base58.Decode(b58)

	pk := PublicKey{}

	if keyLen := len(key); keyLen != 32 {
		return pk, fmt.Errorf(
			"invalid format for public key, length was not 32, was %v",
			keyLen,
		)
	}

	copy(pk[0:32], key)

	return pk, nil
}

func CreateProgramAddress(seeds [][]byte, programID PublicKey) (PublicKey, error) {
	if len(seeds) > MaxSeeds {
		return PublicKey{}, ErrMaxSeedLengthExceeded
	}

	for _, seed := range seeds {
		if len(seed) > MaxSeedLength {
			return PublicKey{}, ErrMaxSeedLengthExceeded
		}
	}

	buf := []byte{}

	for _, seed := range seeds {
		buf = append(buf, seed...)
	}

	buf = append(buf, programID[:]...)

	buf = append(buf, []byte(ProgramDerivedAddressMarker)...)

	hash := sha256.Sum256(buf)

	if ValidCurve(hash[:]) {
		return PublicKey{}, errors.New("invalid seeds; address must fall off the curve")
	}

	return PublicKeyFromBytes(hash[:]), nil
}

func PublicKeyFromBytes(b []byte) PublicKey {
	var pk PublicKey
	copy(pk[:], b)
	return pk
}

func (p PublicKey) Bytes() []byte {
	return []byte(p[:])
}

func (pk PublicKey) IsZero() bool {
	return pk == PublicKey{}
}

func (pk PublicKey) Equals(pub PublicKey) bool {
	return pk == pub
}

func (pk PublicKey) ToBase58() string {
	p := [32]byte(pk)
	return base58.Encode(p[:])
}

// String the public key to get it's base58 version
func (pk PublicKey) String() string {
	return pk.ToBase58()
}

func (pk PublicKey) ToBase64() string {
	p := [32]byte(pk)
	return base64.StdEncoding.EncodeToString(p[:])
}
