
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-amqp-backlog-checker

RUN make

ENTRYPOINT [ "./microservice-amqp-backlog-checker.o" ]
