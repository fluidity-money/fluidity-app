FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-solana-reward-release

COPY . .

RUN make

FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-solana-reward-release/microservice-solana-reward-release.out .

ENTRYPOINT [ "./microservice-solana-reward-release.out" ]
