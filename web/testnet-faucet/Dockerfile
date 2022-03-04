
FROM node:16 as build

ARG PAT_STRING

ENV REPO reponamehere

ENV WORKDIR /usr/src/${REPO}

WORKDIR ${WORKDIR}

ENV PATH /app/node_modules.bin:$PATH

COPY package.json package-lock.json ./

RUN npm i

COPY . ./

RUN make build

FROM nginx:stable-alpine

COPY --from=build \
	/usr/src/reponamehere/dist \
	/usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
