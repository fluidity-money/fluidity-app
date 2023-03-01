import * as hre from 'hardhat';
import * as ethers from 'ethers';
import { AAVE_V2_POOL_PROVIDER_ADDR, AUSDT_ADDR } from '../test-constants';
import { bindings, contracts } from './setup-mainnet';

describe("token liquidity provider swapping", async function () {
  before(async function () {
    if (process.env.FLU_FORKNET_NETWORK !== "mainnet") {
      return this.skip();
    }
  });

  it("should support swapping from compound to aave v2", async function () {
    const newProviderFactory = await hre.ethers.getContractFactory("AaveV2LiquidityProvider");
    const newProvider = await newProviderFactory.deploy();

    await newProvider.init(
      AAVE_V2_POOL_PROVIDER_ADDR,
      AUSDT_ADDR,
      contracts.usdt.deployedToken.address,
    );

    const newProviderAddress = newProvider.address;

    await bindings.usdt.externalOperator.upgradeLiquidityProvider(newProviderAddress);

    const oldProviderAddress = contracts.usdt.deployedPool.address;

    await bindings.usdt.externalOperator.upgradeLiquidityProvider(oldProviderAddress);
  });
});
