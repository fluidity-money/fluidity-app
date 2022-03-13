FROM fluidity/go-docker:latest AS base

ENV WORKDIR /usr/src/fluidity-worker-base

WORKDIR ${WORKDIR}

COPY . .

# download dependencies
FROM fluidity/go-docker:latest AS mod
ENV WORKDIR /usr/src/fluidity-worker-base
WORKDIR ${WORKDIR}

COPY go.mod .
COPY go.sum .
RUN go mod download -x 

# run unit/integration tests
FROM mod AS test
ENV WORKDIR /usr/src/fluidity-worker-base
WORKDIR ${WORKDIR}

ARG FLU_REDIS_ADDR
ARG FLU_DEBUG

COPY --from=base ${WORKDIR} .
ENTRYPOINT ["go", "test", "./..."]
