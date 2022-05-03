
FROM fluidity/build-container:latest

WORKDIR /usr/local/src/fluidity/cmd/microservice-common-count-wins

COPY . .

RUN make

ENTRYPOINT [ \
	"wait-for-amqp", \
	"./microservice-common-count-wins.o" \
]
