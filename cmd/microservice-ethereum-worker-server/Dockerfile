
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-worker-server

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-worker-server.o"
]
