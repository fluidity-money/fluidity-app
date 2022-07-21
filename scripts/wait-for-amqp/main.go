// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

package main

// test if AMQP is running using an environment variable every second
// 20 times, if success run arguments, if failure then exit with 1 and
// a message. if FLU_DEBUG is not set to false, then log debug messages.

import (
	"log"
	"os"
	"os/exec"
	"time"

	"github.com/streadway/amqp"
)

// attemptCount to try before giving up (loudly!)
const attemptCount = 50

func testAmqp(address string) error {
	connection, err := amqp.Dial(address)

	if err != nil {
		return err
	}

	defer connection.Close()

	_, err = connection.Channel()

	return err
}

func main() {
	var (
		debugEnabled = os.Getenv("FLU_DEBUG") != "false"
		amqpAddress  = os.Getenv("FLU_AMQP_QUEUE_ADDR")
		arguments    = os.Args[1:]
	)

	if amqpAddress == "" {
		log.Fatal(
			"FLU_AMQP_QUEUE_ADDR is not set!",
		)
	}

	var (
		ticker = time.Tick(time.Second)
		err    error
	)

	for attempt := 0; attempt < attemptCount; attempt++ {
		_ = <-ticker

		if err = testAmqp(amqpAddress); err == nil {
			break
		}

		if debugEnabled {
			log.Printf(
				"Failed to connect to AMQP! Attempt %v of %v. %v",
				attempt,
				attemptCount,
				err,
			)
		}
	}

	if err != nil {
		log.Fatalf(
			"Failed to connect to AMQP! %v",
			err,
		)
	}

	if len(arguments) == 0 {
		os.Exit(0)
	}

	var (
		command     = arguments[0]
		commandArgs []string
	)

	if len(arguments) > 1 {
		commandArgs = arguments[1:]
	}

	cmd := exec.Command(command, commandArgs...)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	cmd.Env = os.Environ()

	if err := cmd.Run(); err != nil {
		log.Fatal(err)
	}
}
