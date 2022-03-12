#!/bin/sh

AUTOMATION_DIR=automation

docker-compose \
	-f "$AUTOMATION_DIR/docker-compose.ethereum.yml" \
	-f "$AUTOMATION_DIR/docker-compose.infrastructure.yml" \
	-f "$AUTOMATION_DIR/docker-compose.ethereum.fluidity.money.yml" $@
