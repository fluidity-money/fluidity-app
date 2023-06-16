
import { BigNumber } from "ethers";

import { ethers } from "ethers";

const Zero = ethers.constants.Zero;

const pickRatio = (
  num1: BigNumber,
  num2: BigNumber,
  perc1: BigNumber
): [BigNumber, BigNumber] => {
  if (num1.eq(Zero) || num2.eq(Zero)) return [Zero, Zero];
  const perc2 = BigNumber.from(10).pow(12).sub(perc1);
  const [comp1, comp2] = [num1.div(perc1), num2.div(perc2)];
  const x = comp1.gt(comp2) ? comp2 : comp1;
  const a = perc1.mul(x);
  const b = perc2.mul(x);
  return [a, b];
};


const main = () => {
  const [ left, right ] = pickRatio(
    BigNumber.from("869595610").mul(BigNumber.from(10).pow(12)),
    BigNumber.from("115792089237316195423570985008687907853269984664640564039457584007913129639935"),
    BigNumber.from("999476160561")
  );

  console.log(`left: ${left.div(BigNumber.from(10).pow(12))}, right: ${right}`);
};

main();
