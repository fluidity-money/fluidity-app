
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-user-actions

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-user-actions.o" \
]
