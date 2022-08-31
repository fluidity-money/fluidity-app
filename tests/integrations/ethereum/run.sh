#!/bin/sh
# default runs test runner once then quits, otherwise sends args to docker compose

cd $(dirname $0)

automation_dir="$(git rev-parse --show-toplevel)/automation"

export COMPOSE_ENV_FILE="$automation_dir/docker-compose-envs"
export INTEGRATIONS_DIR="$(pwd)"

if [[ ! -v FLU_ETHEREUM_HTTP_URL ]]; then
    echo "FLU_ETHEREUM_HTTP_URL is not set!"
    exit 1
fi

if [[ $# -eq 0 ]]; then
docker-compose \
  -f "$automation_dir/docker-compose.rabbitmq.yml" \
  -f "$automation_dir/docker-compose.infrastructure.yml" \
  -f "$automation_dir/docker-compose.volumes.yml" \
  -f "docker-compose-integrations.yml" \
  build

docker-compose \
  -f "$automation_dir/docker-compose.rabbitmq.yml" \
  up -d --remove-orphans rabbitmq
  
docker-compose \
  -f "$automation_dir/docker-compose.infrastructure.yml" \
  -f "$automation_dir/docker-compose.volumes.yml" \
  -f "docker-compose-integrations.yml" \
  run integration-test-runner-ethereum

docker-compose \
  -f "$automation_dir/docker-compose.rabbitmq.yml" \
  down

else
docker-compose \
  -f "$automation_dir/docker-compose.rabbitmq.yml" \
  -f "$automation_dir/docker-compose.infrastructure.yml" \
  -f "$automation_dir/docker-compose.volumes.yml" \
  -f "docker-compose-integrations.yml" \
  $@
fi

