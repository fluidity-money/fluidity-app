FROM fluidity/build-container:latest AS build

WORKDIR /usr/local/src/fluidity/cmd/microservice-epoch-rotation

COPY . .
RUN make


FROM fluidity/runtime-container:latest

COPY --from=build /usr/local/src/fluidity/cmd/microservice-epoch-rotation/microservice-epoch-rotation.out .

ENTRYPOINT [ \
	"wait-for-database", \
	"./microservice-epoch-rotation.out" \
]
