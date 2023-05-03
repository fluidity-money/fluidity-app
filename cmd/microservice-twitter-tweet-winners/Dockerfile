FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-twitter-tweet-winners

COPY . .
RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-twitter-tweet-winners/microservice-twitter-tweet-winners.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-twitter-tweet-winners.out" \
]
