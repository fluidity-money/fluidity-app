package solana

type (
	SolRpcBody struct {
		JsonRpc string      `json:"jsonrpc"`
		Method  string      `json:"method"`
		Params  interface{} `json:"params"`
		Id      string      `json:"id"`
	}

	ProgramSubscribeParams [2]interface{}

	ProgramSubscribeParamsFilters struct {
		Encoding   string `json:"encoding"`
		Commitment string `json:"commitment"`
	}

	SubscriptionResponse struct {
		Jsonrpc string `json:"jsonrpc"`
		Result  int    `json:"result,omitempty"`
		Id      int    `json:"method"`
		Error   struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}

	ProgramSubscribeResponse struct {
		Jsonrpc string `json:"jsonrpc"`
		Method  string `json:"method"`
		Params  struct {
			Result       ProgramNotification `json:"result"`
			Subscription int                 `json:"subscription"`
		} `json:"params"`
	}

	ProgramNotification struct {
		Context struct {
			Slot int `json:"slot"`
		} `json:"context"`
		Value struct {
			Pubkey  string `json:"pubkey"`
			Account struct {
				Lamports   int       `json:"lamports"`
				Data       [2]string `json:"data"`
				Owner      string    `json:"owner"`
				Executable bool      `json:"executable"`
				RentEpoch  int       `json:"rentEpoch"`
			} `json:"account"`
		} `json:"value"`
	}

	TribecaProgramData struct {
		Crunchy uint64
		Smooth  uint64
	}
)
