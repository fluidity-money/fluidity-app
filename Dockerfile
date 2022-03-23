
FROM golang:buster

RUN apt-get update && apt-get install -y \
	openssl \
	ca-certificates \
	make \
	protobuf-compiler \
	postgresql-client

ENV FLUID_DIR /usr/local/src/fluidity

COPY go.mod ${FLUID_DIR}/go.mod
COPY go.sum ${FLUID_DIR}/go.sum

COPY scripts ${FLUID_DIR}/scripts

WORKDIR ${FLUID_DIR}/scripts

RUN make install

COPY build.mk ${FLUID_DIR}/build.mk
COPY golang.mk ${FLUID_DIR}/golang.mk

COPY contracts ${FLUID_DIR}/contracts

COPY database ${FLUID_DIR}/database

COPY common ${FLUID_DIR}/common
COPY lib ${FLUID_DIR}/lib
COPY cmd ${FLUID_DIR}/cmd

RUN rm -rf /go/pkg/mod/cache/
