FROM fluidity/build-web-container:latest AS build

WORKDIR /usr/local/src/fluidity/web

ENV PATH /app/node_modules.bin:$PATH

COPY . ./

RUN yarn

WORKDIR /usr/local/src/fluidity/web/fanfare

RUN make build

FROM fluidity/runtime-web-container:latest

WORKDIR /usr/local/src/fluidity/web

COPY --from=build /usr/local/src/fluidity/web .

EXPOSE 3111

WORKDIR /usr/local/src/fluidity/web/fanfare

CMD ["yarn", "start"]
