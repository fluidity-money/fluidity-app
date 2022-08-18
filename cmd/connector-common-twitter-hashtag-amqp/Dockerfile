FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/connector-common-twitter-hashtag-amqp

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/connector-common-twitter-hashtag-amqp/connector-common-twitter-hashtag-amqp.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./connector-common-twitter-hashtag-amqp.out" \
]

