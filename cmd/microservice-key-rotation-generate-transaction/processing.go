package main

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

type parsePhase int
const (
    parseInfo parsePhase = iota
    parseBeginDigest
    parseDigest
    parseEndDigest
)

const (
    InfoRegexString = `^\[.+\] Changing oracle address on contract (\w+) from (\w+) to (\w+)!$`
    BeginDigestLine = `-----Begin Digest-----`
    EndDigestLine = `-----End Digest-----`
)

var InfoRegex = regexp.MustCompile(InfoRegexString)

func parseLogs(path string) ([]OracleUpdate, error) {
    file, err := os.Open(path)

    if err != nil {
        log.Fatal(func(k *log.Log) {
            k.Message = "Failed to open log file!"
            k.Payload = err
        })
    }

    defer file.Close()

    scanner := bufio.NewScanner(file)

    var (
        phase           parsePhase = parseInfo
        contractAddress common.Address
        oldOracle       common.Address
        newOracle       common.Address

        oracleChanges []OracleUpdate
    )

    for scanner.Scan() {
        line := scanner.Text()

        switch phase {
        case parseInfo:
            contractAddress, oldOracle, newOracle, err = parseInfoLine(line)

            phase = parseBeginDigest

        case parseBeginDigest:
            if line != BeginDigestLine {
                err = fmt.Errorf(
                    "Unexpected line, expected '%s', got '%s'!",
                    BeginDigestLine,
                    line,
                )
            }

            phase = parseDigest

        case parseEndDigest:
            if line != EndDigestLine {
                err = fmt.Errorf(
                    "Unexpected line, expected '%s', got '%s'!",
                    EndDigestLine,
                    line,
                )
            }

            phase = parseInfo

        case parseDigest:
            err = parseDigestLine(line, oldOracle, newOracle)

            if err == nil {
                oracleUpdate := OracleUpdate {
                    OldOracle: oldOracle,
                    NewOracle: newOracle,
                    Contract: contractAddress,
                }

                oracleChanges = append(oracleChanges, oracleUpdate)
            }

            phase = parseEndDigest

        default:
            err = fmt.Errorf(
                "Unexpected parse phase %d!",
                phase,
            )
        }

        if err != nil {
            return nil, fmt.Errorf(
                "Error parsing the log file! %w",
                err,
            )
        }
    }

    return oracleChanges, nil
}

func parseInfoLine(line string) (contractAddress, oldOracle, newOracle common.Address, err error) {
    info := InfoRegex.FindStringSubmatch(line)

    if info == nil {
        err = fmt.Errorf("Failed to parse line '%s'!", line)
        return
    }

    var (
        contractAddressString = info[1]
        oldOracleString       = info[2]
        newOracleString       = info[3]
    )

    contractAddress = common.HexToAddress(contractAddressString)
    oldOracle = common.HexToAddress(oldOracleString)
    newOracle = common.HexToAddress(newOracleString)

    return
}

func parseDigestLine(line string, oldOracle, newOracle common.Address) (error) {
    // remove the brackets
    elemsString := line[1:len(line) - 1]

    elems := strings.Split(elemsString, " ")

    sig := make([]byte, len(elems))

    for i, elemString := range elems {
        elem, err := strconv.Atoi(elemString)

        if err != nil {
            return fmt.Errorf(
                "Failed to parse an int from a digest string! %w",
                err,
            )
        }

        sig[i] = byte(elem)
    }

    // validate the digest

    digest := newOracle.Hash().Bytes()

    rec, err := crypto.Ecrecover(digest, sig)

    if err != nil {
        return fmt.Errorf(
            "Failed to validate signed digest! %w",
            err,
        )
    }

    recoveredPubkey, err := crypto.UnmarshalPubkey(rec)

    if err != nil {
        return fmt.Errorf(
            "Failed to parse recovered pubkey! %w",
            err,
        )
    }

    recoveredAddress := crypto.PubkeyToAddress(*recoveredPubkey)

    if recoveredAddress != oldOracle {
        return fmt.Errorf(
            "Recovered public key doesn't match the old oracle! Old oracle was %s, recovered signer was %s!",
            oldOracle.String(),
            recoveredAddress.String(),
        )
    }

    log.Debug(func(k *log.Log) {
        k.Message = "Recovered address matches!"
    })

    return nil
}

