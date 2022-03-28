
FROM golang:1.17-buster

RUN apt-get update && apt-get install -y \
	openssl \
	ca-certificates \
	make \
	protobuf-compiler \
	postgresql-client

ENV FLUID_DIR /usr/local/src/fluidity

WORKDIR ${FLUID_DIR}

COPY go.mod .
COPY go.sum .

COPY scripts scripts

WORKDIR ${FLUID_DIR}/scripts

RUN make install

WORKDIR ${FLUID_DIR}

COPY build.mk .
COPY golang.mk .

COPY contracts contracts

COPY database database

COPY common common
COPY lib lib

COPY Makefile .

RUN make build
