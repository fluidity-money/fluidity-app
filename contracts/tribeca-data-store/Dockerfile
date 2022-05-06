
FROM node:lts-buster-slim

RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    make \
    npm 

ENV FLUID_DIR /usr/local/src/fluidity

WORKDIR ${FLUID_DIR}

COPY package.json .
COPY package-lock.json .
COPY yarn.lock .

COPY tsconfig.json .

RUN npm install

#RUN npm install -g npx
#RUN npm install -g ts-node

COPY tribeca tribeca

COPY goki goki

COPY scripts scripts

COPY target target

COPY ETeo.json .

COPY blah.ts .

RUN ls

ENTRYPOINT npx ts-node --compilerOptions '{"resolveJsonModule":true}' scripts/queue-proposal.ts

