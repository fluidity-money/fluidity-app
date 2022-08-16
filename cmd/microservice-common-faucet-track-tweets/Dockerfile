FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-faucet-track-tweets

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-faucet-track-tweets/microservice-common-faucet-track-tweets.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-faucet-track-tweets.o" \
]

