package microservice_common_track_winners

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
