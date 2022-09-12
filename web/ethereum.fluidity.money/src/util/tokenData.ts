// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import ChainId, { chainIdFromEnv } from "./chainId";
import ropsten from "../config/ropsten-tokens.json";
import testing from "../config/testing-tokens.json";
import kovan from "../config/kovan-tokens.json";
import aurora from "../config/aurora-mainnet-tokens.json";
import mainnet from "../config/mainnet-tokens.json";
import { TokenKind } from "components/types";

const chainId = chainIdFromEnv();
// Assigns the correct json file based on ChainId
export const tokenData =
  chainId === ChainId.Ropsten
    ? (ropsten as TokenKind[])
    : chainId === ChainId.Hardhat
    ? (testing as TokenKind[])
    : chainId === ChainId.Kovan
    ? (kovan as TokenKind[])
    : chainId === ChainId.AuroraMainnet
    ? (aurora as TokenKind[])
    : chainId === ChainId.Mainnet
    ? (mainnet as TokenKind[])
    : (ropsten as TokenKind[]);
