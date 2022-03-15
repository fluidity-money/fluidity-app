
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-rabbitmq-backlog-checker

RUN make

ENTRYPOINT [ "./microservice-rabbitmq-backlog-checker.o" ]
