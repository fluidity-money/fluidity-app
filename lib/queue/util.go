// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package queue

import (
	"fmt"
	"io"
	"bufio"
	"bytes"
	"os"

	"github.com/fluidity-money/fluidity-app/lib/util"
	"github.com/fluidity-money/fluidity-app/lib/log"
)

// RandomConsumerPrefixLength to append to the worker id
const RandomConsumerPrefixLength = 8

// generateRandomConsumerId by taking a workerId name and appending
// .<random number> to it
func generateRandomConsumerId(workerId string) string {
	randomString := util.RandomString(RandomConsumerPrefixLength)

	consumerId := fmt.Sprintf(
		"%s.%s",
		workerId,
		randomString,
	)

	return consumerId
}

func scanStrings(path string, in io.Reader) (strings []string) {
	scanner := bufio.NewScanner(in)

	scanner.Split(func(data []byte, atEOF bool) (advance int, token []byte, err error) {
		if atEOF && len(data) == 0 {
			return 0, nil, nil
		}

		i := bytes.Index(data, []byte("\r\n"))

		if i >= 0 {
			return i + 2, data[0:i], nil
		}

		if atEOF {
			return len(data), data, nil
		}

		return 0, nil, nil
	})

	for scanner.Scan() {
		t := scanner.Text()

		strings = append(strings, t)
	}

	switch err := scanner.Err(); err {
	case nil, io.EOF:
		// ignore

	default:
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Error reading chunks from the queue messages file %#v!",
				path,
			)

			k.Payload = err
		})
	}

	return strings
}

// getFakeMessages by reading a file and creating the Message type from
// the chunks separated by \r\n
func getFakeMessages(path string) (messages []Message) {
	f, err := os.Open(path)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Context = Context

			k.Format(
				"Failed to open path %#v to read fake queue messages from!",
				path,
			)

			k.Payload = err
		})
	}

	defer f.Close()

	strings := scanStrings(path, f)

	messages = make([]Message, len(strings))

	for i, s := range strings {
		buf := bytes.NewBufferString(s)

		messages[i] = Message{
			Content: buf,
		}
	}

	return
}

