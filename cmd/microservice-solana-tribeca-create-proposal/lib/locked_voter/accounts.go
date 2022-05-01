// Code generated by https://github.com/gagliardetto/anchor-go. DO NOT EDIT.

package locked_voter

import (
	"fmt"
	ag_binary "github.com/gagliardetto/binary"
	ag_solanago "github.com/gagliardetto/solana-go"
)

type Locker struct {
	Base         ag_solanago.PublicKey
	Bump         uint8
	TokenMint    ag_solanago.PublicKey
	LockedSupply uint64
	Governor     ag_solanago.PublicKey
	Params       LockerParams
}

var LockerDiscriminator = [8]byte{74, 246, 6, 113, 249, 228, 75, 169}

func (obj Locker) MarshalWithEncoder(encoder *ag_binary.Encoder) (err error) {
	// Write account discriminator:
	err = encoder.WriteBytes(LockerDiscriminator[:], false)
	if err != nil {
		return err
	}
	// Serialize `Base` param:
	err = encoder.Encode(obj.Base)
	if err != nil {
		return err
	}
	// Serialize `Bump` param:
	err = encoder.Encode(obj.Bump)
	if err != nil {
		return err
	}
	// Serialize `TokenMint` param:
	err = encoder.Encode(obj.TokenMint)
	if err != nil {
		return err
	}
	// Serialize `LockedSupply` param:
	err = encoder.Encode(obj.LockedSupply)
	if err != nil {
		return err
	}
	// Serialize `Governor` param:
	err = encoder.Encode(obj.Governor)
	if err != nil {
		return err
	}
	// Serialize `Params` param:
	err = encoder.Encode(obj.Params)
	if err != nil {
		return err
	}
	return nil
}

func (obj *Locker) UnmarshalWithDecoder(decoder *ag_binary.Decoder) (err error) {
	// Read and check account discriminator:
	{
		discriminator, err := decoder.ReadTypeID()
		if err != nil {
			return err
		}
		if !discriminator.Equal(LockerDiscriminator[:]) {
			return fmt.Errorf(
				"wrong discriminator: wanted %s, got %s",
				"[74 246 6 113 249 228 75 169]",
				fmt.Sprint(discriminator[:]))
		}
	}
	// Deserialize `Base`:
	err = decoder.Decode(&obj.Base)
	if err != nil {
		return err
	}
	// Deserialize `Bump`:
	err = decoder.Decode(&obj.Bump)
	if err != nil {
		return err
	}
	// Deserialize `TokenMint`:
	err = decoder.Decode(&obj.TokenMint)
	if err != nil {
		return err
	}
	// Deserialize `LockedSupply`:
	err = decoder.Decode(&obj.LockedSupply)
	if err != nil {
		return err
	}
	// Deserialize `Governor`:
	err = decoder.Decode(&obj.Governor)
	if err != nil {
		return err
	}
	// Deserialize `Params`:
	err = decoder.Decode(&obj.Params)
	if err != nil {
		return err
	}
	return nil
}

type LockerWhitelistEntry struct {
	Bump      uint8
	Locker    ag_solanago.PublicKey
	ProgramId ag_solanago.PublicKey
	Owner     ag_solanago.PublicKey
}

var LockerWhitelistEntryDiscriminator = [8]byte{128, 245, 238, 138, 226, 48, 216, 63}

func (obj LockerWhitelistEntry) MarshalWithEncoder(encoder *ag_binary.Encoder) (err error) {
	// Write account discriminator:
	err = encoder.WriteBytes(LockerWhitelistEntryDiscriminator[:], false)
	if err != nil {
		return err
	}
	// Serialize `Bump` param:
	err = encoder.Encode(obj.Bump)
	if err != nil {
		return err
	}
	// Serialize `Locker` param:
	err = encoder.Encode(obj.Locker)
	if err != nil {
		return err
	}
	// Serialize `ProgramId` param:
	err = encoder.Encode(obj.ProgramId)
	if err != nil {
		return err
	}
	// Serialize `Owner` param:
	err = encoder.Encode(obj.Owner)
	if err != nil {
		return err
	}
	return nil
}

func (obj *LockerWhitelistEntry) UnmarshalWithDecoder(decoder *ag_binary.Decoder) (err error) {
	// Read and check account discriminator:
	{
		discriminator, err := decoder.ReadTypeID()
		if err != nil {
			return err
		}
		if !discriminator.Equal(LockerWhitelistEntryDiscriminator[:]) {
			return fmt.Errorf(
				"wrong discriminator: wanted %s, got %s",
				"[128 245 238 138 226 48 216 63]",
				fmt.Sprint(discriminator[:]))
		}
	}
	// Deserialize `Bump`:
	err = decoder.Decode(&obj.Bump)
	if err != nil {
		return err
	}
	// Deserialize `Locker`:
	err = decoder.Decode(&obj.Locker)
	if err != nil {
		return err
	}
	// Deserialize `ProgramId`:
	err = decoder.Decode(&obj.ProgramId)
	if err != nil {
		return err
	}
	// Deserialize `Owner`:
	err = decoder.Decode(&obj.Owner)
	if err != nil {
		return err
	}
	return nil
}

type Escrow struct {
	Locker          ag_solanago.PublicKey
	Owner           ag_solanago.PublicKey
	Bump            uint8
	Tokens          ag_solanago.PublicKey
	Amount          uint64
	EscrowStartedAt int64
	EscrowEndsAt    int64
	VoteDelegate    ag_solanago.PublicKey
}

var EscrowDiscriminator = [8]byte{31, 213, 123, 187, 186, 22, 218, 155}

func (obj Escrow) MarshalWithEncoder(encoder *ag_binary.Encoder) (err error) {
	// Write account discriminator:
	err = encoder.WriteBytes(EscrowDiscriminator[:], false)
	if err != nil {
		return err
	}
	// Serialize `Locker` param:
	err = encoder.Encode(obj.Locker)
	if err != nil {
		return err
	}
	// Serialize `Owner` param:
	err = encoder.Encode(obj.Owner)
	if err != nil {
		return err
	}
	// Serialize `Bump` param:
	err = encoder.Encode(obj.Bump)
	if err != nil {
		return err
	}
	// Serialize `Tokens` param:
	err = encoder.Encode(obj.Tokens)
	if err != nil {
		return err
	}
	// Serialize `Amount` param:
	err = encoder.Encode(obj.Amount)
	if err != nil {
		return err
	}
	// Serialize `EscrowStartedAt` param:
	err = encoder.Encode(obj.EscrowStartedAt)
	if err != nil {
		return err
	}
	// Serialize `EscrowEndsAt` param:
	err = encoder.Encode(obj.EscrowEndsAt)
	if err != nil {
		return err
	}
	// Serialize `VoteDelegate` param:
	err = encoder.Encode(obj.VoteDelegate)
	if err != nil {
		return err
	}
	return nil
}

func (obj *Escrow) UnmarshalWithDecoder(decoder *ag_binary.Decoder) (err error) {
	// Read and check account discriminator:
	{
		discriminator, err := decoder.ReadTypeID()
		if err != nil {
			return err
		}
		if !discriminator.Equal(EscrowDiscriminator[:]) {
			return fmt.Errorf(
				"wrong discriminator: wanted %s, got %s",
				"[31 213 123 187 186 22 218 155]",
				fmt.Sprint(discriminator[:]))
		}
	}
	// Deserialize `Locker`:
	err = decoder.Decode(&obj.Locker)
	if err != nil {
		return err
	}
	// Deserialize `Owner`:
	err = decoder.Decode(&obj.Owner)
	if err != nil {
		return err
	}
	// Deserialize `Bump`:
	err = decoder.Decode(&obj.Bump)
	if err != nil {
		return err
	}
	// Deserialize `Tokens`:
	err = decoder.Decode(&obj.Tokens)
	if err != nil {
		return err
	}
	// Deserialize `Amount`:
	err = decoder.Decode(&obj.Amount)
	if err != nil {
		return err
	}
	// Deserialize `EscrowStartedAt`:
	err = decoder.Decode(&obj.EscrowStartedAt)
	if err != nil {
		return err
	}
	// Deserialize `EscrowEndsAt`:
	err = decoder.Decode(&obj.EscrowEndsAt)
	if err != nil {
		return err
	}
	// Deserialize `VoteDelegate`:
	err = decoder.Decode(&obj.VoteDelegate)
	if err != nil {
		return err
	}
	return nil
}
