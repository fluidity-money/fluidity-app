package microservice_amqp_backlog_checker

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/fluidity-money/fluidity-app/lib/log"
)

const (
	// RmqManagementScheme is the scheme of RabbitMQ management API
	RmqManagementScheme = "http"

	// RmqManagementPort is the default port of RabbitMQ management API
	RmqManagementPort = 15672
)

// Returns URL to query RMQ Managment API for queues
func getManagementUrlFromAddr(address, username, password string) string {
	queueManagementUri_, err := url.Parse(address)

	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("Could not parse URL (%v)", address)
			k.Payload = err
		})
	}

	queueManagementUri_.Scheme = RmqManagementScheme

	if port := queueManagementUri_.Port(); port != "" {
		queueManagementUri_.Host = strings.Replace(queueManagementUri_.Host, ":"+port, "", 1)
	}

	queueManagementUri_.Host += fmt.Sprintf(":%v", RmqManagementPort)

	rmqUserInfo := url.UserPassword(username, password)
	queueManagementUri_.User = rmqUserInfo

	queueManagementUri_.Path = "api/queues"

	queueManagementUri := queueManagementUri_.String()

	return queueManagementUri
}

// Returns array of queue structs from RMQ
func GetRmqQueues(rmqAddress, rmqUsername, rmqPassword string) RmqQueuesResponse {
	queueManagementUri := getManagementUrlFromAddr(rmqAddress, rmqUsername, rmqPassword)

	res, err := http.Get(queueManagementUri)
	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("Could not GET url (%v)", queueManagementUri)
			k.Payload = err
		})
	}

	defer res.Body.Close()

	response := make(RmqQueuesResponse, 0)

	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		log.Fatal(func(k *log.Log) {
			k.Format("Could not deserialize response body (%v)", res.Body)
			k.Payload = err
		})
	}

	return response
}
