
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/connector-solana-amqp

COPY . .

RUN make

ENTRYPOINT [ "wait-for-amqp", "./connector-solana-amqp.o" ]
