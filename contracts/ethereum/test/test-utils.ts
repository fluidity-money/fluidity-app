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
