# merge our contracts into one file, which a lot of tools require
FROM node as sol-merger

WORKDIR /usr/app
COPY package.json /usr/app/package.json

RUN ["npm", "install", "--production"]
RUN ["npm", "install", "sol-merger"]

COPY . /usr/app

RUN ["npx", "sol-merger", "contracts/Token.sol"]

# sol-merger leaves multiple SPDX license IDs in the resulting file, which is a compile error
RUN ["sed", "-i", "-e", "/SPDX/d", "-e", "1 i //SPDX-License-Identifier: UNLICENSED", "contracts/Token_merged.sol"]


## slither
FROM trailofbits/eth-security-toolbox as slither

WORKDIR /home/ethsec

# this image doesn't include solc 0.8.11, install it manually
COPY analysis/bin /home/ethsec/analysis/bin

RUN ["curl", "https://binaries.soliditylang.org/linux-amd64/solc-linux-amd64-v0.8.11+commit.d7f03943", "-o", "solc-v0.8.11"]
RUN ["chmod", "ugo+x", "solc-v0.8.11"]

# add our own solc wrapper to PATH
ENV PATH="/home/ethsec/analysis/bin:$PATH"

COPY --from=sol-merger /usr/app/contracts/Token_merged.sol /home/ethsec/Token_merged.sol

ENTRYPOINT ["slither", "Token_merged.sol"]


## semgrep
FROM returntocorp/semgrep as semgrep

WORKDIR /src

COPY --from=sol-merger /usr/app/contracts/Token_merged.sol /src/Token_merged.sol

ENTRYPOINT ["semgrep", "--config", "auto", "/src/Token_merged.sol"]


## mythril
FROM mythril/myth as mythril

WORKDIR /home/mythril

COPY --from=sol-merger /usr/app/contracts/Token_merged.sol /home/mythril/Token_merged.sol

ENTRYPOINT ["myth", "analyze", "--execution-timeout", "30", "/home/mythril/Token_merged.sol"]
