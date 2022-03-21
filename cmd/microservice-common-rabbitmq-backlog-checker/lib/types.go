package microservice_common_amqp_backlog_checker

type (
	RmqQueue struct {
		Name            string `json:"name"`
		Node            string `json:"node"`
		State           string `json:"state"`
		Vhost           string `json:"vhost"`
		MessagesReady   uint64 `json:"messages_ready"`
		MessagesUnacked uint64 `json:"messages_unacknowledged"`
	}

	Vhost struct {
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

	RmqQueuesResponse []RmqQueue

	VhostsResponse []Vhost
)
