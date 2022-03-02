package main

import (
	"time"
	"os"
	"github.com/eclipse/paho.mqtt.golang"
	"log"
	"os/exec"
	"net/url"
	"strings"
	"fmt"
)

const maxAttempts = 50

func testMqtt(servers_ []string, username, password string) error {
	servers := make([]*url.URL, len(servers_))

	for i, server := range servers_ {
		address, err := url.Parse(server)

		if err != nil {
			return fmt.Errorf(
				"Failed to parse a URL for the string %v! %v",
				server,
				err,
			)
		}

		servers[i] = address
	}

	clientOptions := mqtt.ClientOptions{
		Servers: servers,
		Username: username,
		Password: password,
	}

	client := mqtt.NewClient(&clientOptions)

	err := client.Connect().Error()

	return err
}

func main() {
	var (
		enabledDebug = os.Getenv("FLU_DEBUG") == "true"
		queueAddresses_ = os.Getenv("FLU_QUEUE_ADDR")
		queueUsername = os.Getenv("FLU_QUEUE_USERNAME")
		queuePassword = os.Getenv("FLU_QUEUE_PASSWORD")
		arguments = os.Args[1:]
	)

	if queueAddresses_ == "" {
		log.Fatal("FLU_QUEUE_ADDR not set!")
	}

	queueAddresses := strings.Split(queueAddresses_, ",")

	var err error

	timer := time.Tick(time.Second)

	for attempt := 0; attempt < maxAttempts; attempt++ {
		_ = <-timer

		err = testMqtt(
			queueAddresses,
			queueUsername,
			queuePassword,
		)

		if err == nil {
			break
		}

		if enabledDebug {
			log.Printf(
				"Failed to connect to MQTT attempt %v of %v! %v",
				attempt,
				maxAttempts,
			)
		}
	}

	if err != nil {
		log.Fatalf(
			"Failed to connect to MQTT! %v",
			err,
		)
	}

	var (
		commandName string
		commandArgs []string
	)

	switch len(arguments) {
	case 0:
		os.Exit(0)

	default:
		commandArgs = arguments[1:]
		fallthrough

	case 1:
		commandName = arguments[0]
	}

	cmd := exec.Command(commandName, commandArgs...)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Env = os.Environ()

	if err := cmd.Run(); err != nil {
		log.Fatal(err)
	}
}
