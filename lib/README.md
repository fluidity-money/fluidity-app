
# Fluidity Microservice Library

Fluidity is a stablecoin for people who can’t afford to leave their
money idle generating interest. **Fluidity rewards users when they actually
use it**.

This microservice library contains code that's used internally within
Fluidity's backend systems. Usecases include statistics, beta and feature
rollout and more. Though not intended to be used publicly, this code can
be open sourced.

## Environment variables

|         Name          |                              Description
|-----------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`       | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`           | Toggle debug messages produced by any application using the debug logger.    |
| `FLU_SENTRY_URL`      | String that may be optionally set with a Sentry URL to log app.              |
| `FLU_WEB_LISTEN_ADDR` | Host:port to listen on when using web.                                       |
| `FLU_AMQP_QUEUE_ADDR` | AMQP queue address connected to to receive and send messages down.           |
| `FLU_POSTGRES_URI`    | Database URI to use when connecting to the Postgres database.                |
| `FLU_TIMESCALE_URI`   | Database URI to use when connecting to the Timescale database.               |
| `FLU_REDIS_HOST`      | Hostname to connect to for the Redis (state) codebase.                       |
| `FLU_REDIS_PASSWORD`  | Password to use when connecting to the Redis host.                           |

## Building

	make build

## Testing
	
Testing utilises the standard `testing` package as well as `testify` for assertions.

	make test

To display overall test coverage:

	make test-coverage

Directories that do not contain any statements are intentionally excluded from testing:

	types/beta
	types/faucet
	types/ido
	types/network
	types/past-winnings
	types/prize-pool
	types/ethereum/erc20
	types/solana
	types/twitter
	types/user-updates
	types/website
	types/winners
	types/worker
	fluidity-app/lib (top level consts file)

## Building a Docker image

	make docker
