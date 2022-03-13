#!/bin/sh

# adapted from
# https://blog.harrison.dev/2016/06/19/integration-testing-with-docker-compose.html

compose_file="docker-compose-test.yml"

log() {
	>&2 echo $@
}

cleanup () {
	docker-compose -f $COMPOSE_FILE kill
	docker-compose -f $COMPOSE_FILE rm -f --all
}

trap 'cleanup ; log "Tests failed unexpectedly!"'\
	HUP INT QUIT PIPE TERM

export test_command=$@

docker-compose -f "$compose_file" up -d

exit_code=$(docker wait fluidity-worker-test-worker-1)

docker logs fluidity-worker-test-worker-1

if [ "$exit_code" -ne 0 ] ; then
	log "Tests failed with exit code $exit_code!"
else
	log "Tests passed!"
fi

cleanup

exit $TEST_EXIT_CODE
