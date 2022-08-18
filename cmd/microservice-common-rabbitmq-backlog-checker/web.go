package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

const (
	// RmqManagementScheme is the scheme of RabbitMQ management API
	// Only uses this scheme if hostname is localhost
	RmqManagementScheme = "http"

	// RmqManagementPort is the default port of RabbitMQ management API
	// Only uses this port if hostname is localhost
	RmqManagementPort = 15672

	// AwsManagementScheme is the scheme of AWS RMQ management API
	AwsManagementScheme = "https"

	// AwsManagementPort is the default port of AWS RMQ management API
	AwsManagementPort = 443
)

type (
	rmqQueue struct {
		Name            string `json:"name"`
		Node            string `json:"node"`
		State           string `json:"state"`
		Vhost           string `json:"vhost"`
		MessagesReady   uint64 `json:"messages_ready"`
		MessagesUnacked uint64 `json:"messages_unacknowledged"`
	}

	vhost struct {
		Cluster                       interface{} `json:"cluster_state"`
		Description                   string      `json:"description"`
		Messages                      uint64      `json:"messages"`
		MessagesDetails               interface{} `json:"messages_details"`
		MessagesReady                 uint64      `json:"messages_ready"`
		MessagesReadyDetails          interface{} `json:"messages_ready_details"`
		MessagesUnacked               uint64      `json:"messages_unacknowledged"`
		MessagesUnacknowledgedDetails interface{} `json:"messages_unacknowledged_details"`
		Metadata                      interface{} `json:"metadata"`
		Name                          string      `json:"name"`
		RecvOct                       uint64      `json:"recv_oct"`
		RecvOctDetails                interface{} `json:"recv_oct_details"`
		SendOct                       uint64      `json:"send_oct"`
		SendOctDetails                interface{} `json:"send_oct_details"`
		Tags                          []string    `json:"tags"`
		Tracing                       bool        `json:"tracing"`
	}

	rmqQueuesResponse []rmqQueue

	vhostsResponse []vhost
)

type RMQManagementClient struct {
	rmqAddress string
}

func NewRmqManagementClient(rmqAddress string) *RMQManagementClient {
	return &RMQManagementClient{
		rmqAddress: rmqAddress,
	}
}

// Returns URL to query RMQ Managment API for queues
func getManagementUrlFromAddr(address string) (string, error) {
	queueManagementUri_, err := url.Parse(address)

	if err != nil {
		return "", err
	}

	if port := queueManagementUri_.Port(); port != "" {
		queueManagementUri_.Host = strings.Replace(queueManagementUri_.Host, ":"+port, "", 1)
	}

	queueManagementUri_.Scheme = AwsManagementScheme

	portString := fmt.Sprintf(":%v", AwsManagementPort)

	if queueManagementUri_.Hostname() == "localhost" {
		queueManagementUri_.Scheme = RmqManagementScheme

		portString = fmt.Sprintf(":%v", RmqManagementPort)
	}

	queueManagementUri_.Host += portString

	queueManagementUri := queueManagementUri_.String()

	return queueManagementUri, nil
}

// Returns array of queue structs from RMQ
func (r *RMQManagementClient) getRmqQueues(vhost string) (rmqQueuesResponse, error) {
	queueManagementUri, err := getManagementUrlFromAddr(r.rmqAddress)

	queueManagementUri += fmt.Sprintf("/%s/%s/%s", "api", "queues", url.PathEscape(vhost))

	if err != nil {
		return nil, err
	}

	res, err := r.Get(queueManagementUri)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	var response rmqQueuesResponse

	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func (r *RMQManagementClient) Get(url string) (res *http.Response, err error) {
	request, _ := http.NewRequest(http.MethodGet, url, nil)

	return http.DefaultClient.Do(request)
}

// Returns array of queue structs from RMQ
func (r *RMQManagementClient) getVhosts() (vhostsResponse, error) {
	queueManagementUri, err := getManagementUrlFromAddr(r.rmqAddress)
	if err != nil {
		return nil, err
	}

	queueManagementUri += fmt.Sprintf("/%s/%s", "api", "vhosts")

	res, err := r.Get(queueManagementUri)
	if err != nil {
		return nil, err
	}

	defer res.Body.Close()

	var response vhostsResponse

	err = json.NewDecoder(res.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	return response, nil
}

func isDeadLetterQueue(queueName string) bool {
	return strings.HasSuffix(queueName, ".dead")	
}
