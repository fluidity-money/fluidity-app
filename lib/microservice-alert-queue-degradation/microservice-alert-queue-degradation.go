package microservice_alert_queue_degradation

import (
	"net/http"
	"fmt"
	"net/url"
	"encoding/json"
)

type (
	// Queue returned by RabbitMQ via the management interface, super truncated
	Queue struct {
		Name string `json:"name"`
		Node string `json:"node"`
		State string `json:"state"`
		Vhost string `json:"vhost"`
		MessagesReady int `json:"messages_ready"`
	}
)

// GetQueues by querying the /api/queues endpoint with BASIC authentication
func GetQueues(url *url.URL) (queues []Queue, err error) {
	var (
		request http.Request
		client http.Client
	)

	url.Path = "/api/queues"

	if url.User != nil {
		username := url.User.Username()
		password, _ := url.User.Password()
		request.SetBasicAuth(username, password)
	}

	request.Method = "GET"

	request.URL = url

	resp, err := client.Do(&request)

	if err != nil {
		return nil, fmt.Errorf(
			"failed to request queues from the endpoint! %v",
			err,
		)
	}

	defer resp.Body.Close()

	queues = make([]Queue, 0)

	if err := json.NewDecoder(resp.Body).Decode(&queues); err != nil {
		return nil, fmt.Errorf(
			"failed to decode the JSON blob from the server with the queues! %v",
			err,
		)
	}

	return queues, nil
}
