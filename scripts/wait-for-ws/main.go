// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE file.

package main

// hacky script to test that websocket is working on the environment
// variable FLU_ETHEREUM_WS_URL

import (
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/gorilla/websocket"
)

const maxCount = 50

func testWs(address string) error {
	client, _, err := websocket.DefaultDialer.Dial(
		address,
		nil,
	)

	if err != nil {
		return err
	}

	defer client.Close()

	return nil
}

func main() {
	var (
		debugEnabled = os.Getenv("FLU_DEBUG") == "true"
		wsAddress    = os.Getenv("FLU_ETHEREUM_WS_URL")
		arguments    = os.Args[1:]
	)

	if wsAddress == "" {
		wsAddress = os.Getenv("FLU_QUEUE_ADDR")
	}

	timer := time.Tick(time.Second)

	var err error

	for attempt := 0; attempt < maxCount; attempt++ {
		_ = <-timer

		if err = testWs(wsAddress); err == nil {
			break
		}

		if debugEnabled {
			log.Printf(
				"Failed to connect to %#v! %v",
				wsAddress,
				err,
			)
		}
	}

	if err != nil {
		log.Fatalf(
			"Failed to connect to WS! %v",
			err,
		)
	}

	var (
		commandName      string
		commandArguments []string
	)

	switch len(arguments) {
	case 0:
		os.Exit(0)

	default:
		commandArguments = arguments[1:]
		fallthrough

	case 1:
		commandName = arguments[0]
	}

	cmd := exec.Command(commandName, commandArguments...)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Env = os.Environ()

	if err := cmd.Run(); err != nil {
		log.Fatal(err)
	}
}
