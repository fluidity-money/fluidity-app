// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import * as ethers from 'ethers';
import { assert } from 'chai';

export const expectEq = (a: ethers.BigNumberish, b: ethers.BigNumberish) => {
    const aBN = ethers.BigNumber.from(a);
    const bBN = ethers.BigNumber.from(b);
    assert(aBN.eq(bBN), `${aBN.toString()} != ${bBN.toString()}`);
};

export const expectGt = (a: ethers.BigNumberish, b: ethers.BigNumberish) => {
    const aBN = ethers.BigNumber.from(a);
    const bBN = ethers.BigNumber.from(b);
    assert(aBN.gt(bBN), `!(${aBN.toString()} > ${bBN.toString()})`);
};
