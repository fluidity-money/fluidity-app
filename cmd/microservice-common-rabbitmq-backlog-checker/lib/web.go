package microservice_common_amqp_backlog_checker

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

const (
	// RmqManagementScheme is the scheme of RabbitMQ management API
	RmqManagementScheme = "http"

	// RmqManagementPort is the default port of RabbitMQ management API
	RmqManagementPort = 15672
)

// Returns URL to query RMQ Managment API for queues
func getManagementUrlFromAddr(address string) (string, error) {
	queueManagementUri_, err := url.Parse(address)

	if err != nil {
		return "", err
	}

	queueManagementUri_.Scheme = RmqManagementScheme

	if port := queueManagementUri_.Port(); port != "" {
		queueManagementUri_.Host = strings.Replace(queueManagementUri_.Host, ":"+port, "", 1)
	}

	queueManagementUri_.Host += fmt.Sprintf(":%v", RmqManagementPort)

	queueManagementUri_.Path = "api/queues"

	queueManagementUri := queueManagementUri_.String()

	return queueManagementUri, nil
}

// Returns array of queue structs from RMQ
func GetRmqQueues(rmqAddress string) (RmqQueuesResponse, error) {
	queueManagementUri, err := getManagementUrlFromAddr(rmqAddress)

	if err != nil {
		return nil, err
	}

	res, err := http.Get(queueManagementUri)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	response := make(RmqQueuesResponse, 0)

	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	return response, nil
}
