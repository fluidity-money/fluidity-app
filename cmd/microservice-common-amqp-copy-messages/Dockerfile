
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-amqp-copy-messages

COPY . .

RUN make

ENTRYPOINT [ "./microservice-common-amqp-copy-messages.o" ]
