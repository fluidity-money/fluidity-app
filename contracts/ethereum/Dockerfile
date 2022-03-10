FROM node:16 as build

ARG FLU_ETHEREUM_ORACLE_ADDRESS 

WORKDIR /app
ENV PATH /app/node_modules.bin:$PATH
ENV REPO fluidity-eth-contracts

COPY package.json ./

RUN npm i
COPY . ./

RUN npx hardhat compile

ENV FLU_ETHEREUM_ORACLE_ADDRESS ${FLU_ETHEREUM_ORACLE_ADDRESS}

CMD ["npx", "hardhat", "deploy-forknet"]
