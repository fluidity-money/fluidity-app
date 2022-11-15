FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-user-limits

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-user-limits/microservice-solana-user-limits.out .

ENTRYPOINT [ \
	"wait-for-database.sh", \
	"./microservice-solana-user-limits.out" \
]
