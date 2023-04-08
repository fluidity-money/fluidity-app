// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package meson

import (
	"encoding/binary"
	"fmt"

	ethAbi "github.com/ethereum/go-ethereum/accounts/abi"
	ethCommon "github.com/ethereum/go-ethereum/common"
	ethCrypto "github.com/ethereum/go-ethereum/crypto"

	"math"
	"math/big"

	"github.com/fluidity-money/fluidity-app/lib/log"
	"github.com/fluidity-money/fluidity-app/lib/types/misc"
	"github.com/fluidity-money/fluidity-app/lib/types/worker"
)

const (
	// Meson token ID of fluid token
	// currently this is USDC!
	FluidTokenIndex = 1

	// Meson github says all values use 6 decimals
	MesonDecimals = 6

	// End of the txn function discriminant bytes
	EncodedSwapStart = 4
	// Size of the encodedswap
	EncodedSwapSize = 32

	// Bitmask to check if the service fee was waived
	ServiceFeeWaiveMask = "0x40000000000000000000"
	// Service fee rate (n/10000)
	ServiceFeeRate = 10

	// Bitmask to check if a swap was signed in the non-typed manner
	SignNonTypedMask = "0x0800000000000000000000000000000000000000000000000000"

	// Bitmask to get s value from yParityAndS
	yParityAndSMask = "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"

	// Start of amount bytes within encodedswap
	AmountBytesStart = 1
	// Size of amount bytes
	AmountBytesSize = 5
	// Start of swap salt bytes within encodedswap
	SaltBytesStart = 6
	// Size of swap salt bytes
	SaltBytesSize = 10
	// Start of LP fee bytes within encodedswap
	LPFeeBytesStart = 16
	// Size of LP fee bytes
	LPFeeBytesSize = 5
	// Location of token out index within encodedswap
	OutTokenIndexByte = 28
	// Location of token in index within encodedswap
	InTokenIndexByte = 31

	// Constant values to be hashed
	EthereumSignHeader52 = "\x19Ethereum Signed Message:\n52"

	ReleaseTypeHash = "bytes32 Sign to release a swap on Mesonaddress Recipient"
)

// abi string of executeSwap function
const mesonAbiString = `[
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "encodedSwap",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "yParityAndS",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "depositToPool",
          "type": "bool"
        }
      ],
      "name": "executeSwap",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]`

var mesonAbi ethAbi.ABI

// GetMesonFees returns meson's LP and Service Fees as reported by
// the encoded swap
func GetMesonFees(transfer worker.EthereumApplicationTransfer, inputData misc.Blob) (*big.Rat, error) {
	fee := new(big.Rat)

	// check the transaction function
	method, err := mesonAbi.MethodById(inputData)

	if err != nil {
		return nil, fmt.Errorf(
			"Failed to get method from inputData! %v",
			err,
		)
	}

	if method.Name != "executeSwap" {
		log.App(func(k *log.Log) {
			k.Format(
				"Method %v does not match executeSwap!",
				method.Name,
			)
		})

		return nil, nil
	}

	// make sure the input is correct len
	enoughBytes := len(inputData) >= EncodedSwapStart+EncodedSwapSize

	if !enoughBytes {
		return nil, fmt.Errorf(
			"Not enough bytes in input data! needed %v but got %v!",
			EncodedSwapStart+EncodedSwapSize,
			len(inputData),
		)
	}

	// get the encoded swap
	encodedSwap := inputData[EncodedSwapStart : EncodedSwapStart+EncodedSwapSize]

	// check token IDs to make sure it's a fluid transfer
	outTokenIndex := uint8(encodedSwap[OutTokenIndexByte])
	outTokenIsFluid := outTokenIndex == FluidTokenIndex

	inTokenIndex := uint8(encodedSwap[InTokenIndexByte])
	inTokenIsFluid := inTokenIndex == FluidTokenIndex

	if !inTokenIsFluid && !outTokenIsFluid {
		log.App(func(k *log.Log) {
			k.Format(
				"Received a Meson swap in transaction %#v not involving the fluid token - skipping!",
				transfer.TransactionHash.String(),
			)
		})

		return nil, nil
	}

	// get the salt bytes
	saltBytes := encodedSwap[SaltBytesStart : SaltBytesStart+SaltBytesSize]

	salt := new(big.Int)
	salt.SetBytes(saltBytes)

	// convert service fee waive check bitmast to bigint
	ServiceFeeWaiveMaskInt, success := new(big.Int).SetString(ServiceFeeWaiveMask, 0)

	if !success {
		return nil, fmt.Errorf(
			"Failed to convert Service Fee Waiver bitmask to bigInt %v",
			ServiceFeeWaiveMask,
		)
	}

	// check if the service fee was waived
	serviceFeeWaived := new(big.Int).And(salt, ServiceFeeWaiveMaskInt)

	// if the service fee was paid
	if serviceFeeWaived.Sign() == 0 {

		// get the amount and decode it
		amountBytes := encodedSwap[AmountBytesStart : AmountBytesStart+AmountBytesSize]
		// extend slice to 8 bytes from 5
		amountBytesExtended := extend8B(amountBytes)

		amount := binary.BigEndian.Uint64(amountBytesExtended[:])

		// calculate 0.1% of amount
		serviceFee := amount * ServiceFeeRate * 10000

		fee.Add(fee, big.NewRat(int64(serviceFee), 1))
	}

	// get LP fee
	feeBytes := encodedSwap[LPFeeBytesStart : LPFeeBytesStart+LPFeeBytesSize]
	// extend to 8 bytes
	feeBytesExtended := extend8B(feeBytes)

	// add our values
	feeAmount := binary.BigEndian.Uint64(feeBytesExtended[:])

	fee.Add(fee, big.NewRat(int64(feeAmount), 1))

	// meson gives values with 6 decimals
	decimalsAdjusted := math.Pow10(MesonDecimals)
	decimalsRat := new(big.Rat).SetFloat64(decimalsAdjusted)

	// adjust for token decimals
	fee.Quo(fee, decimalsRat)

	return fee, nil
}

// Extend byte slice to 8 bytes
func extend8B(bytes []byte) [8]byte {
	var extended [8]byte
	copy(extended[8-len(bytes):], bytes)
	return extended
}

func GetInitiator(inputData misc.Blob) (string, error) {
	// check the transaction function
	method, err := mesonAbi.MethodById(inputData)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to get method from inputData! %v",
			err,
		)
	}

	if method.Name != "executeSwap" {
		log.App(func(k *log.Log) {
			k.Format(
				"Method %v does not match executeSwap!",
				method.Name,
			)
		})

		return "", nil
	}

	// init args map
	args := make(map[string]interface{})

	// unpack args
	err = method.Inputs.UnpackIntoMap(args, inputData[4:])

	if err != nil {
		return "", fmt.Errorf(
			"Failed to unpack executeSwap input args! %v",
			err,
		)
	}

	// check if the release signature is signed non-typed
	nonTypedMask, success := new(big.Int).SetString(SignNonTypedMask, 0)

	if !success {
		return "", fmt.Errorf(
			"Failed to convert Service Fee Waiver bitmask to bigInt %v",
			ServiceFeeWaiveMask,
		)
	}

	encodedSwapInt, ok := (args["encodedSwap"].(*big.Int))

	if !ok {
		return "", fmt.Errorf(
			"Failed to get encodedSwap as *big.Int from args!",
		)
	}

	nonTypedInt := new(big.Int).And(encodedSwapInt, nonTypedMask)

	// get the recipient
	recipient, ok := args["recipient"].(ethCommon.Address)

	if !ok {
		return "", fmt.Errorf(
			"Failed to get recipient as string from args!",
		)
	}

	// construct the digest based on whether the message is signed non-typed
	// this code is taken from MesonHelpers.sol
	digest := []byte{}
	if nonTypedInt.Sign() > 0 {
		//digest = keccak256(abi.encodePacked(ETH_SIGN_HEADER_52, encodedSwap, recipient));
		digest = append(append([]byte(EthereumSignHeader52), encodedSwapInt.Bytes()...), recipient.Bytes()...)

		digest = ethCrypto.Keccak256(digest)
	} else {
		digestBytes := append(encodedSwapInt.Bytes(), recipient.Bytes()...)
		digestBytes = ethCrypto.Keccak256(digestBytes)

		typeHash := ethCrypto.Keccak256([]byte(ReleaseTypeHash))

		digest = append(typeHash, digestBytes...)
		digest = ethCrypto.Keccak256(digest)
	}

	// decode signature from txn input
	r, ok := args["r"].([32]byte)

	if !ok {
		return "", fmt.Errorf(
			"Failed to get r component of sig as []byte from args!",
		)
	}

	// decode s and v from joined bytearray using mask
	yParityAndS, ok := args["yParityAndS"].([32]byte)

	if !ok {
		return "", fmt.Errorf(
			"Failed to get yParityAndS as []byte from args!",
		)
	}

	yParityAndSInt := new(big.Int).SetBytes(yParityAndS[:])

	yParityAndSMaskInt, success := new(big.Int).SetString(yParityAndSMask, 0)

	if !success {
		return "", fmt.Errorf(
			"Failed to convert Service Fee Waiver bitmask to bigInt %v",
			ServiceFeeWaiveMask,
		)
	}

	s := new(big.Int).And(yParityAndSInt, yParityAndSMaskInt)

	// get v by bitshifting
	v := new(big.Int).Rsh(yParityAndSInt, 255).Bytes()

	// calculate signature
	sig := append(append(r[:], s.Bytes()...), v[0])

	// ecrecover using signature and digest
	signer, err := ethCrypto.Ecrecover(digest, sig)

	if err != nil {
		return "", fmt.Errorf(
			"Failed to get signer from ecrecover! %v",
			err,
		)
	}

	// deserialise signer
	sender, err := ethCrypto.UnmarshalPubkey(signer)

	senderAddress := ethCrypto.PubkeyToAddress(*sender).String()

	return senderAddress, nil
}
