
FROM node:16 as build

ARG REACT_APP_API_URL
ARG REACT_APP_WALLET_CONNECT_GETH_URI
ARG REACT_APP_WEBSOCKET
ARG REACT_APP_ETHEREUM_CONTRACT_ADDR
ARG REACT_APP_ETHEREUM_USDT_ADDR
ARG REACT_APP_CHAIN_ID

ENV REPO fluidity-webapp
ENV WORKDIR /usr/src/${REPO}

ENV PRODUCTION ${PRODUCTION}

WORKDIR $WORKDIR

ENV PATH /app/node_modules.bin:$PATH

COPY package.json package-lock.json ./

RUN npm i

COPY . ./

RUN make

FROM nginx:stable-alpine
COPY --from=build /usr/src/fluidity-webapp/build /usr/share/nginx/html
RUN sed -i "$(( $(grep 'location /' /etc/nginx/conf.d/default.conf -n | cut -d: -f 1) + 2))s/$/\n        try_files \$uri \\/index.html =404; /" /etc/nginx/conf.d/default.conf
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
