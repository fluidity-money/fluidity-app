
FROM fluidity/build-container-root:latest

WORKDIR ${FLUID_DIR}

COPY contracts contracts

COPY database database

COPY go.mod .
COPY go.sum .

COPY build.mk .
COPY golang.mk .
COPY node.mk .

COPY common common
COPY lib lib

COPY Makefile .

COPY build.mk .
COPY golang.mk .
COPY node.mk .

COPY go.mod .
COPY go.sum .
