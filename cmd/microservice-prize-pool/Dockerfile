
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-prize-pool

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-prize-pool.o" \
]
