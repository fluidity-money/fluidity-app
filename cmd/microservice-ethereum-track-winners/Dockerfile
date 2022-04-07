
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-track-winners

COPY . .

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-ethereum-track-winners.o" \
]
