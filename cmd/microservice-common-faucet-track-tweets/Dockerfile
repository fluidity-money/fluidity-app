
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-faucet-track-tweets

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-faucet-track-tweets.o" \
]
