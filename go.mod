module github.com/fluidity-money/fluidity-app

go 1.17

require (
	filippo.io/edwards25519 v1.0.0-rc.1
	github.com/btcsuite/btcutil v0.0.0-20190425235716-9e5f4b9a998d
	github.com/ethereum/go-ethereum v1.10.16
	github.com/getsentry/sentry-go v0.12.0
	github.com/go-redis/redis/v8 v8.11.4
	github.com/go-redsync/redsync/v4 v4.5.0
	github.com/gorilla/websocket v1.5.0
	github.com/graphql-go/graphql v0.8.0
	github.com/lib/pq v1.10.4
	github.com/near/borsh-go v0.3.1
	github.com/rabbitmq/amqp091-go v1.4.0
	github.com/stretchr/testify v1.7.2
	golang.org/x/crypto v0.0.0-20210921155107-089bfa567519
)

require github.com/g8rswimmer/go-twitter/v2 v2.1.2 // indirect

require (
	github.com/StackExchange/wmi v0.0.0-20180116203802-5d049714c4a6 // indirect
	github.com/aws/aws-lambda-go v1.34.1
	github.com/aws/aws-sdk-go v1.44.85
	github.com/btcsuite/btcd v0.20.1-beta // indirect
	github.com/cespare/xxhash/v2 v2.1.2 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/deckarep/golang-set v1.8.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/go-ole/go-ole v1.2.1 // indirect
	github.com/go-stack/stack v1.8.0 // indirect
	github.com/google/uuid v1.1.5 // indirect
	github.com/hashicorp/errwrap v1.0.0 // indirect
	github.com/hashicorp/go-multierror v1.1.0 // indirect
	github.com/jmespath/go-jmespath v0.4.0 // indirect
	github.com/onsi/ginkgo v1.16.5 // indirect
	github.com/pmezard/go-difflib v1.0.0 // indirect
	github.com/rjeczalik/notify v0.9.1 // indirect
	github.com/shirou/gopsutil v3.21.4-0.20210419000835-c7a38de76ee5+incompatible // indirect
	github.com/tklauser/go-sysconf v0.3.5 // indirect
	github.com/tklauser/numcpus v0.2.2 // indirect
	golang.org/x/sys v0.0.0-20211216021012-1d35b9e2eb4e // indirect
	gopkg.in/natefinch/npipe.v2 v2.0.0-20160621034901-c1b8fa8bdcce // indirect
	gopkg.in/yaml.v3 v3.0.1 // indirect
)

replace github.com/etherum/go-ethereum => github.com/fluidity-money/go-ethereum v1.10.18-0.20220509234010-89e6988df1fc
