
ORG_ROOT := fluidity

.PHONY: build watch clean

GO_BUILD := go build
GO_TEST := go test -cover
GO_FMT := go fmt

DOCKER_BUILD := docker build
DOCKER_COMPOSE := docker-compose

MAKEFLAGS += --no-print-directory
