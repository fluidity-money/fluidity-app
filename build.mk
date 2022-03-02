
ORG_ROOT := fluidity

.PHONY: build

GO_BUILD := go build
GO_TEST := go test -cover
GO_FMT := go fmt

DOCKER_BUILD := docker build

MAKEFLAGS += --no-print-directory
