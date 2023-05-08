FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-lootbox-referral-activator

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-lootbox-referral-activator/microservice-lootbox-referral-activator.out .

ENTRYPOINT [ \
	"wait-for-amqp", \
	"wait-for-database.sh", \
	"./microservice-lootbox-referral-activator.out" \
]
