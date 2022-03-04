
FROM fluidity-money/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-ethlogs-amqp

RUN make

ENTRYPOINT [ "./microservice-faucet-track-tweets" ]
