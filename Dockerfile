
FROM fluidity/build-container-root:latest

WORKDIR ${FLUID_DIR}

COPY contracts contracts

COPY database database

COPY common common
COPY lib lib

COPY Makefile .

RUN make build

COPY build.mk .
COPY golang.mk .
COPY node.mk .

COPY go.mod .
COPY go.sum .
