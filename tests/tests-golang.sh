#!/bin/sh -e

. ./tests-profile.sh

if [ "$FLU_RUN_INTEGRATION_TESTS" = "true" ]; then
	cd ./infrastructure
	docker-compose up -d
	cd ..
	go test ../...
	docker-compose down
else
	go test ../... -test.short
fi
