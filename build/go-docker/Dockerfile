
FROM golang:buster

RUN apt-get update && apt-get install -y \
	openssl \
	ca-certificates \
	make \
	protobuf-compiler \
	postgresql-client

WORKDIR /usr/src/golang

COPY . .

RUN make install

RUN rm -rf /go/pkg/mod/cache/
