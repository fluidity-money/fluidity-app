import * as hre from 'hardhat';
import * as ethers from 'ethers';
import { fUsdtAccount, fUsdtOperator } from './setup-mainnet';
import { getStorageAt } from './test-utils';
import { AAVE_V2_POOL_PROVIDER_ADDR, AUSDT_ADDR } from '../test-constants';
import { accountAddr } from './setup-common';

describe("token aave integration", async function () {
  it("should support swapping from compound to aave v2", async function () {
    const newProviderFactory = await hre.ethers.getContractFactory("AaveV2LiquidityProvider");
    const newProvider = await newProviderFactory.deploy();

    await newProvider.init(
      AAVE_V2_POOL_PROVIDER_ADDR,
      AUSDT_ADDR,
      fUsdtOperator.address
    );

    const newProviderAddress = newProvider.address;

    const operatorAddress = await fUsdtOperator.operator();

    await fUsdtOperator.callStatic.upgradeLiquidityProvider(newProviderAddress);
  });
});
