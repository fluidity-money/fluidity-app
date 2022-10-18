import type { AbiItem } from "web3-utils";
import type { Token } from "~/util/chainUtils/tokens";

import tokenAbi from "./Token.json";

import Web3 from "web3";
import { bytesToHex } from "web3-utils";
import {
  getTokenForNetwork,
  getTokenFromAddress,
  B64ToUint8Array,
<<<<<<< HEAD
  jsonPost,
} from "~/util";
import config from "~/webapp.config.server";

type ManualRewardBody = {
  // Address of initiator
  address: string,

  // Name of Token being front-run
  token_short_name: string,
};

type ManualRewardRes = {
  // Error message on unsuccessful call
  error?: string,

  // Base64 encoded signature for calling
  // manual-reward in Token.sol
  payload?: {
    reward: {
      winner: string,
      win_amount: number,
      first_block: number,
      last_block: number,
    },
    signature: string,
  },
}


=======
} from "~/util";
import config from "~/webapp.config.server";

>>>>>>> develop
const claimRewards = async (address: string, networkId = 0) => {
  const ethServer = config.drivers["ethereum"][networkId].server;

  const network = "ethereum";

  const fluidTokensContracts = getTokenForNetwork(network);

  const fluidTokensConfig = fluidTokensContracts
<<<<<<< HEAD
    // Get Token Configs from Fluid Token addresses
    .map((fToken) => getTokenFromAddress(network, fToken))
    // Assert list contains Token Configs
    .filter((config): config is Token => !!config);

  const unwrappedTokens = fluidTokensConfig
    // Assert list contains Fluid Token Configs
=======
    .map((fToken) => getTokenFromAddress(network, fToken))
    .filter((config): config is Token => !!config);

  const unwrappedTokens = fluidTokensConfig
>>>>>>> develop
    .filter(
      (fTokenConfig): fTokenConfig is Token & { isFluidOf: string } =>
        !!fTokenConfig.isFluidOf
    )
<<<<<<< HEAD
    // Get Token Configs from Fluid Token unwrapped counterpart addresses
=======
>>>>>>> develop
    .map((fTokenConfig) => {
      const unwrappedTokenConfig = getTokenFromAddress(
        network,
        fTokenConfig.isFluidOf
      );

      if (!unwrappedTokenConfig) return undefined;

      return {
        symbol: unwrappedTokenConfig.symbol,
        name: unwrappedTokenConfig.name,
        logo: unwrappedTokenConfig.logo,
        address: fTokenConfig.address,
      };
    })
<<<<<<< HEAD
    // Assert list contains Token Configs
    .filter((unwrappedTokens): unwrappedTokens is Token => !!unwrappedTokens);

  const rewardingTokens = fluidTokensConfig.concat(unwrappedTokens);
  const manualRewardUrl = `${ethServer}/manual-reward`;
  
=======
    .filter((unwrappedTokens): unwrappedTokens is Token => !!unwrappedTokens);

  const rewardingTokens = fluidTokensConfig.concat(unwrappedTokens);
>>>>>>> develop
  const rewards = await Promise.all(
    rewardingTokens.map(async (tokenConfig) => {
      const manualRewardBody = {
        address,
        token_short_name: tokenConfig.symbol,
      };
<<<<<<< HEAD
      
      const { error, payload } = await jsonPost<ManualRewardBody, ManualRewardRes>(
        manualRewardUrl,
        manualRewardBody
      );
=======
      const res = await fetch(`${ethServer}/manual-reward`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(manualRewardBody),
      });

      const { error, payload } = await res.json();
>>>>>>> develop

      if (error || !payload) return 0;

      // Call eth contract
      const tokenContract = new new Web3(
        config.drivers["ethereum"][networkId].rpc.http ?? ""
      ).eth.Contract(tokenAbi as unknown as AbiItem, tokenConfig.address);

      const { winner, win_amount, first_block, last_block } = payload.reward;

      const { signature: b64Signature } = payload;

      // convert B64 -> byte[] -> hex string
      const uint8Signature = B64ToUint8Array(b64Signature);
      const hexSignature = bytesToHex(Array.from(uint8Signature));

      await tokenContract.methods
        .manualReward(
          // contractAddress
          tokenConfig.address,
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
          hexSignature
        )
        .send({ from: address });

      return win_amount;
    })
  );

  return rewards;
};

const ethInstructions = {
  claimRewards,
};

export default ethInstructions;
