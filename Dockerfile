
FROM fluidity/build-container-root:latest

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
