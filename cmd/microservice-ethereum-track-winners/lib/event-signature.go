// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package microservice_ethereum_track_winners

import (
	"fmt"
	"golang.org/x/crypto/sha3"
)

// HashEventSignature to find the hex representation of a event signature
func HashEventSignature(eventSignature string) string {
	var (
		eventSignatureBytes = []byte(eventSignature)
		hash                = sha3.NewLegacyKeccak256()
		hashDigest          []byte
	)

	hash.Write(eventSignatureBytes)

	hashDigest = hash.Sum(nil)

	return fmt.Sprintf("0x%x", hashDigest)
}
