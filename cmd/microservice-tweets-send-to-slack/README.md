
# <name of repo here>

<explanation of repo here>

## Environment variables

|           Name           |                              Description
|--------------------------|------------------------------------------------------------------------------|
| `FLU_WORKER_ID`          | Worker ID used to identify the application in logging and to the AMQP queue. |
| `FLU_DEBUG`              | Toggle debug messages produced by any application using the debug logger.    |

<if you're using queue features:>
| `FLU_AMQP_QUEUE_ADDR`    | AMQP queue address connected to to receive and send messages down.           |

<if you're using postgres features>
| `FLU_POSTGRES_URI`       | Database URI to use when connecting to the Postgres database.                |

<if you're using timescale features>
| `FLU_TIMESCALE_URI`      | Database URI to use when connecting to the Postgres database.                |

## Building

	make build

## Testing

	make test

## Docker

	make docker
