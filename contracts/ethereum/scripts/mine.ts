// forcibly mine a block on hardhat - this is
// sometimes useful to get external things to update

import hre from 'hardhat';

async function main() {
  await hre.network.provider.send("evm_mine");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
