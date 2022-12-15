
export \
	FLU_DEBUG_DIE_FAST=true \
	FLU_AMQP_QUEUE_ADDR=amqp://fluidity:fluidity@localhost:5672 \
	FLU_POSTGRES_URI=postgres://fluidity:fluidity@localhost?sslmode=disable \
	FLU_TIMESCALE_URI=postgres://fluidity:fluidity@localhost:5433?sslmode=disable \
	FLU_DEBUG=true \
	FLU_REDIS_ADDR=localhost:6379 \
	FLU_WEB_LISTEN_ADDR=localhost:8080 \
	FLU_ETHEREUM_WS_URL=ws://localhost:8545 \
	FLU_ETHEREUM_HTTP_URL=http://localhost:8545 \
	FLU_QUEUE_ADDR=ws://localhost:1884 \
	FLU_ETHEREUM_TOPIC=/fluidity/winners \
	REACT_APP_API_URL=http://localhost:8080 \
	REACT_APP_WEBSOCKET=ws://localhost:8080/updates \
	FLU_API_URI=http://localhost:8080 \
	FLU_WALLET_URL=http://localhost:3000 \
	FLU_ETHEREUM_URL=http://localhost:8545 \
	FLU_DISCORD_WEBHOOK=not_a_webhook

export FLU_WORKER_ID="tests-$(date +%s)"

export FLU_ETHEREUM_FORKNET_URL_MAINNET=$(aws ssm get-parameter --name /fluidity/ethereum/http_url --with-decryption | jq -r .Parameter.Value)
export FLU_ETHEREUM_FORKNET_URL_GOERLI=$(aws ssm get-parameter --name /fluidity/ethereum/goerli/http_url --with-decryption | jq -r .Parameter.Value)
