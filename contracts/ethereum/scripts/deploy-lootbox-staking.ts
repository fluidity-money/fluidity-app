
import hre from "hardhat";

import { mustEnv } from "../script-utils";

const ENV_OPERATOR = `FLU_ETHEREUM_OPERATOR_ADDRESS`;
const ENV_COUNCIL = `FLU_ETHEREUM_EMERGENCY_COUNCIL_ADDRESS`;

const ENV_FUSDC_ADDR = `FLU_FUSDC_ADDRESS`;
const ENV_USDC_ADDR = `FLU_USDC_ADDRESS`;
const ENV_WETH_ADDR = `FLU_WETH_ADDRESS`;

const ENV_CAMELOT_ROUTER= `FLU_CAMELOT_ROUTER`;
const ENV_SUSHISWAP_ROUTER= `FLU_SUSHISWAP_ROUTER`;

const ENV_CAMELOT_FUSDC_USDC = `FLU_CAMELOT_FUSDC_USDC`;
const ENV_CAMELOT_FUSDC_WETH = `FLU_CAMELOT_FUSDC_WETH`;

const ENV_SUSHISWAP_FUSDC_USDC = `FLU_SUSHISWAP_FUSDC_USDC`;
const ENV_SUSHISWAP_FUSDC_WETH = `FLU_SUSHISWAP_FUSDC_WETH`;

const main = async () => {
  const operator = mustEnv(ENV_OPERATOR);
  const council = mustEnv(ENV_COUNCIL);

  const fusdcAddr = mustEnv(ENV_FUSDC_ADDR);
  const usdcAddr = mustEnv(ENV_USDC_ADDR);
  const wethAddr = mustEnv(ENV_WETH_ADDR);

  const camelotRouter = mustEnv(ENV_CAMELOT_ROUTER);
  const sushiswapRouter = mustEnv(ENV_SUSHISWAP_ROUTER);

  const camelotFusdcUsdc = mustEnv(ENV_CAMELOT_FUSDC_USDC);
  const camelotFusdcWeth = mustEnv(ENV_CAMELOT_FUSDC_WETH);

  const sushiswapFusdcUsdc = mustEnv(ENV_SUSHISWAP_FUSDC_USDC);
  const sushiswapFusdcWeth = mustEnv(ENV_SUSHISWAP_FUSDC_WETH);

  const factory = await hre.ethers.getContractFactory("LootboxStaking");
  const proxy = await hre.upgrades.deployProxy(factory);

  const proxyDeployHash = proxy.deployTransaction.hash;

  console.log(
      `deploying proxy for LootboxStaking to ${proxy.address} with transaction ${proxyDeployHash}...`
  );

  await proxy.deployed();

  console.log(
      `deployed proxy for LootboxStaking to ${proxy.address} with transaction ${proxyDeployHash}`
  );

  const initTransaction = await proxy.init(
    operator,
    council,
    fusdcAddr,
    usdcAddr,
    wethAddr,
    camelotRouter,
    sushiswapRouter,
    camelotFusdcUsdc,
    camelotFusdcWeth,
    sushiswapFusdcUsdc,
    sushiswapFusdcWeth
  );

  const initTransactionHash = initTransaction.hash;

  console.log(
      `initialised the transaction with hash ${initTransactionHash}`
  );
};

main()
    .then(() => {
        console.log(`done!`);
        process.exit(0);
    })
    .catch(console.error);

