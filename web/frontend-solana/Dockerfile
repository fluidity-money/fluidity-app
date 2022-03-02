
FROM node:16 as build

ARG REACT_APP_API_URL
ARG REACT_APP_WEBSOCKET
ARG REACT_APP_SENTRY_DSN

ENV REPO frontend-solana
ENV WORKDIR /usr/src/${REPO}

ENV PRODUCTION ${PRODUCTION}

WORKDIR $WORKDIR

ENV PATH /app/node_modules.bin:$PATH

COPY package.json package-lock.json ./

RUN npm i

COPY . ./

RUN make

FROM nginx:stable-alpine
COPY --from=build /usr/src/frontend-solana/build /usr/share/nginx/html
RUN sed -i "$(( $(grep 'location /' /etc/nginx/conf.d/default.conf -n | cut -d: -f 1) + 2))s/$/\n        try_files \$uri \\/index.html =404; /" /etc/nginx/conf.d/default.conf
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
