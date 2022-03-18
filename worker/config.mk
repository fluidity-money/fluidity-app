
BUILD_DIR := build

SRC_CLIENT := src-client
SRC_SERVER := src-server
SRC_LIB := lib

ETHEREUM_CLIENT := ${BUILD_DIR}/ethereum-client.o
ETHEREUM_CLIENT_DIR := ${SRC_CLIENT}/ethereum

ETHEREUM_SERVER := ${BUILD_DIR}/ethereum-server.o
ETHEREUM_SERVER_DIR := ${SRC_SERVER}/ethereum

SOLANA_CLIENT := ${BUILD_DIR}/solana-client.o
SOLANA_CLIENT_DIR := ${SRC_CLIENT}/solana

SOLANA_SERVER := ${BUILD_DIR}/solana-server.o
SOLANA_SERVER_DIR := ${SRC_SERVER}/solana

LIB_FILES := $(shell find lib -name *.go)
GO_FILES  := $(shell find . -name '*.go' -type f)

ETHEREUM_CLIENT_FILES := ${LIB_FILES} $(wildcard ${ETHEREUM_CLIENT_DIR}/*.go)
ETHEREUM_SERVER_FILES := ${LIB_FILES} $(wildcard ${ETHEREUM_SERVER_DIR}/*.go)

SOLANA_SERVER_FILES := ${LIB_FILES} $(wildcard ${SOLANA_SERVER_DIR}/*.go)

DOCKERFILE_CLIENT := Dockerfile.client
DOCKERFILE_SERVER := Dockerfile.server

SCRIPT_START := start.sh

GO_BUILD := go build -o

DOCKER := docker

DOCKER_BUILD := ${DOCKER} build -t

DOCKER_RUN := ${DOCKER} run -it