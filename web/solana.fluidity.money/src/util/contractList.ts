// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {SupportedTokens} from 'components/types';

type Contract = {
    addr: string,
    abi: any, //TODO typing ABI/methods (typechain?)
}

export type SupportedContracts = "USDT" | "CUSDT";
export type SupportedFluidContracts = SupportedContracts | `f${SupportedContracts}`;
type SwapContractList = {
    [k in SupportedTokens]?: {
        [k in SupportedFluidContracts]?: Contract
    }
}

const contractList: SwapContractList = {}

export default contractList;
