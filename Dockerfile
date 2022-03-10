
FROM golang:buster

RUN apt-get update && apt-get install -y \
	openssl \
	ca-certificates \
	make \
	protobuf-compiler \
	postgresql-client

ENV FLUID_DIR /usr/local/src/fluidity

COPY . ${FLUID_DIR}

WORKDIR ${FLUID_DIR}/scripts

RUN make install

RUN rm -rf /go/pkg/mod/cache/
