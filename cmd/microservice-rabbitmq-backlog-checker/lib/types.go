package microservice_amqp_backlog_checker

type (
	RmqQueue struct {
		Name            string `json:"name"`
		Node            string `json:"node"`
		State           string `json:"state"`
		Vhost           string `json:"vhost"`
		MessagesReady   uint64 `json:"messages_ready"`
		MessagesUnacked uint64 `json:"messages_unacknowledged"`
	}

	RmqQueuesResponse []RmqQueue
)
