FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-count-wins

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-common-count-wins/microservice-common-count-wins.o .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-count-wins.o" \
]

