
import { BigNumber } from "ethers";

import { ethers } from "ethers";

const Zero = ethers.constants.Zero;

const pickRatio = (
  num1: BigNumber,
  num2: BigNumber,
  perc1: BigNumber,
  perc2: BigNumber
): [BigNumber, BigNumber] => {
  if (num1.eq(Zero) || num2.eq(Zero)) return [Zero, Zero];
  const [comp1, comp2] = [num1.div(perc1), num2.div(perc2)];
  const x = comp1.gt(comp2) ? comp2 : comp1;
  const a = perc1.mul(x);
  const b = perc2.mul(x);
  return [a, b];
};


const main = () => {
  const [ left, right ] = pickRatio(
    BigNumber.from("1000000000000000000000"),
    BigNumber.from("99999999999"),
    BigNumber.from(10),
    BigNumber.from(90)
  );

  console.log(`left: ${left}, right: ${right}`);
};

main();
