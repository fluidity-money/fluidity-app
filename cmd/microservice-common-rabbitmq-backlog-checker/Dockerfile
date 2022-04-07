
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-rabbitmq-backlog-checker

COPY . .

RUN make

ENTRYPOINT [ "./microservice-common-rabbitmq-backlog-checker.o" ]
