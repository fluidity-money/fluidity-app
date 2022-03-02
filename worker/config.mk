
BUILD_DIR := build

SRC_CLIENT := src-client
SRC_SERVER := src-server
SRC_LIB := lib

ETHEREUM_CLIENT := ${BUILD_DIR}/ethereum-client
ETHEREUM_CLIENT_DIR := ${SRC_CLIENT}/ethereum

ETHEREUM_SERVER := ${BUILD_DIR}/ethereum-server
ETHEREUM_SERVER_DIR := ${SRC_SERVER}/ethereum

SOLANA_CLIENT := ${BUILD_DIR}/solana-client
SOLANA_CLIENT_DIR := ${SRC_CLIENT}/solana

SOLANA_SERVER := ${BUILD_DIR}/solana-server
SOLANA_SERVER_DIR := ${SRC_SERVER}/solana

LIB_FILES := $(shell find lib -name *.go)
ETHEREUM_CLIENT_FILES := ${LIB_FILES} $(wildcard ${ETHEREUM_CLIENT_DIR}/*.go)
ETHEREUM_SERVER_FILES := ${LIB_FILES} $(wildcard ${ETHEREUM_SERVER_DIR}/*.go)

DOCKERFILE_CLIENT := Dockerfile.client
DOCKERFILE_SERVER := Dockerfile.server

SCRIPT_START := start.sh

GO_BUILD := go build -o

DOCKER := docker

DOCKER_BUILD := ${DOCKER} build -t

DOCKER_RUN := ${DOCKER} run -it