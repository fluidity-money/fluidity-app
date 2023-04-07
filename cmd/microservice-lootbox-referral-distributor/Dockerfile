FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-lootbox-referral-distributor

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-lootbox-referral-distributor/microservice-lootbox-referral-distributor.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./microservice-lootbox-referral-distributor.out" \
]
