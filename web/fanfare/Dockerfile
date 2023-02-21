FROM fluidity/build-web-container:latest AS build

WORKDIR /usr/local/src/fluidity/web/fanfare

ENV PATH /app/node_modules.bin:$PATH

COPY . ./

RUN yarn

RUN make build

FROM fluidity/runtime-web-container:latest

WORKDIR /usr/local/src/fluidity/web/

COPY --from=build /usr/local/src/fluidity/web/fanfare .

EXPOSE 3111

CMD ["yarn", "start"]
