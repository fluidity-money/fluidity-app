FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-reset-mint-limits

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-reset-mint-limits/microservice-reset-mint-limits .

ENTRYPOINT [ \
	"./microservice-reset-mint-limits.out" \
]
