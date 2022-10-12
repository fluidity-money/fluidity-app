import type { AbiItem } from "web3-utils";

import tokenAbi from "./Token.json";

import Web3 from "web3";
import { toHex, hexToBytes } from "web3-utils";
import { getTokenForNetwork, getTokenFromAddress } from "~/util";
import config from "~/webapp.config.server";

const claimRewards = async (address: string, networkId = 0) => {
  const ethServer = config.drivers["ethereum"][networkId].server;

  const network = "ethereum";

  const tokens = getTokenForNetwork(network);

  const rewards = await Promise.all(
    tokens.map(async (tokenAddr) => {
      const tokenConfig = getTokenFromAddress(network, tokenAddr);

      if (!tokenConfig) return 0;

      const manualRewardBody = {
        address,
        token_short_name: tokenConfig.symbol,
      };

      const res = await fetch(ethServer, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(manualRewardBody),
      });

      const { error, payload } = await res.json();

      if (error || !payload) return 0;

      // Call eth contract
      const tokenContract = new new Web3(
        config.drivers["ethereum"][networkId].rpc.http ?? ""
      ).eth.Contract(tokenAbi as unknown as AbiItem, tokenAddr);

      const { winner, win_amount, first_block, last_block } = payload.reward;

      await tokenContract.methods
        .manualReward(
          // contractAddress
          tokenAddr,
          // chainid
          networkId,
          // winnerAddress
          winner,
          // winAmount
          win_amount,
          // firstBlock
          first_block,
          // lastBlock
          last_block,
          // sig
          hexToBytes(toHex(payload.signature))
        )
        .call();

      return win_amount;
    })
  );

  return rewards;
};

const ethInstructions = {
  claimRewards,
};

export default ethInstructions;
