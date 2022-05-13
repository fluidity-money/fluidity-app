
FROM golang:1.17-buster

RUN apt-get update && apt-get install -y \
	openssl \
	ca-certificates \
	make \
	protobuf-compiler \
	postgresql-client

ENV FLUID_DIR /usr/local/src/fluidity

ENV NODE_VERSION=16.13.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

RUN node --version

WORKDIR ${FLUID_DIR}

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY scripts scripts

WORKDIR ${FLUID_DIR}/scripts

RUN make install

WORKDIR ${FLUID_DIR}

COPY build.mk .
COPY golang.mk .
COPY node.mk .

COPY contracts contracts

COPY database database

COPY common common
COPY lib lib

COPY Makefile .

RUN make build
