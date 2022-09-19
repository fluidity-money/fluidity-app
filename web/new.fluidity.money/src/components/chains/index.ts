// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import ChainInterface from "./ChainInterface"
import SolanaInterface from "./SolanaInterface";
import EthereumInterface from "./EthereumInterface";
import {ReactNode} from "react";
import {NullableChain} from "./chainContext";
import {ReactSetter} from "../../utils/types";

export type InterfaceProps = {
  children?: ReactNode, 
  setChain: (chain: NullableChain) => void,
  connected: boolean,
  setConnected: ReactSetter<boolean>
}

export {SolanaInterface, EthereumInterface};
export default ChainInterface;
