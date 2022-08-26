
ORG_ROOT := fluidity

INSTALL_DIR := $(or ${INSTALL_DIR},/usr/local/bin)

.PHONY: build watch clean install

GO_BUILD := go build
GO_TEST := go test -cover
GO_FMT := go fmt

NPM_INSTALL := npm install

DOCKER_BUILD := docker build
DOCKER_COMPOSE := docker-compose

SEMGREP_ALL := semgrep --config p/ci --config p/secrets

MAKEFLAGS += --no-print-directory

GO_CMD_DIR := cmd

CONTRACTS_DIR := contracts

WEB_DIR := web
