
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-amqp-copy-messages

RUN make

ENTRYPOINT [ "./microservice-amqp-copy-messages.o" ]
