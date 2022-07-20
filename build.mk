
ORG_ROOT := fluidity

.PHONY: build watch clean

GO_BUILD := go build
GO_TEST := go test -cover
GO_FMT := go fmt

GOLINT_RUN := golangci-lint run

NPM_INSTALL := npm install

DOCKER_BUILD := docker build
DOCKER_COMPOSE := docker-compose

SEMGREP_ALL := semgrep --config p/ci --config p/secrets

MAKEFLAGS += --no-print-directory
