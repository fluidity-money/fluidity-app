
FROM golang:buster

RUN apt-get update && apt-get install -y \
	openssl \
	ca-certificates \
	make \
	protobuf-compiler \
	postgresql-client

COPY . /usr/local/src/fluidity

RUN rm -rf /go/pkg/mod/cache/
