#!/bin/sh -e

host_exists() {
	host=$1
	curl --silent "$host"
	[ $? -ne 6 ]
}

host_exists "rabbit" && wait-for-amqp

(host_exists "postgres" || host_exists "timescale") && wait-for-database.sh

host_exists "contracts" && ./wait-for-geth.sh

go test -run "^$FLU_TEST$"
