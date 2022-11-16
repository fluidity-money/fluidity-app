FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-ethereum-reset-mint-limits

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-ethereum-reset-mint-limits/microservice-ethereum-reset-mint-limits.out .

ENTRYPOINT [ \
	"./microservice-ethereum-reset-mint-limits.out" \
]
