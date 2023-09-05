
// NONE OF THIS WORKS AND SHOULD NOT BE USED!

import * as hre from "hardhat";

import { ethers } from "ethers";

import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import { Wallet, Contract } from "zksync-web3";

import { USDC_ADDR } from "../../zksync-constants";

const EnvOperator = "FLU_ZKSYNC_OPERATOR";

const EnvEmergencyCouncil = "FLU_ZKSYNC_EMERGENCY_COUNCIL";

const EnvPrivateKey = "FLU_ZKSYNC_PRIVATE_KEY";

const EnvProxyAdminOwner = "FLU_ZKSYNC_PROXY_ADMIN_OWNER";

const mustEnv = (n: string): string => {
  const a = process.env[n];
  if (a === "") throw new Error(`${n} must be set!`);
  return a!;
};

const deployArtifact = async(
  d: Deployer,
  artifact: string,
  ...args: any[]
): Promise<Contract> => {
  const a = await d.loadArtifact(artifact);
  return d.deploy(a, args);
};

const main = async () => {
  const privateKey = mustEnv(EnvPrivateKey);
  const proxyAdminOwnerAddr = mustEnv(EnvProxyAdminOwner);
  const operatorAddr = mustEnv(EnvOperator);
  const emergencyCouncilAddr = mustEnv(EnvEmergencyCouncil);

  const wallet = new Wallet(privateKey);
  const deployer = new Deployer(hre, wallet);

  const senderAddr = wallet.address;

  const aTransparentUpgradeableProxy = await deployer.loadArtifact(
    "TransparentUpgradeableProxy"
  );

  const proxyAdmin = await deployArtifact(deployer, "ProxyAdmin", proxyAdminOwnerAddr);

  console.log("deployed proxy admin:", proxyAdmin.address);

  const deployTProxyArtifact = async (
    artifact: string,
    interfac: string,
    ...args: any[]
  ): Promise<Contract> => {
    const impl = await deployArtifact(deployer, artifact);

    console.log(`deployed impl for ${artifact} to ${impl.address}`);

    const iface = new ethers.utils.Interface([interfac]);

    const p = await deployer.deploy(
      aTransparentUpgradeableProxy,
      [
        impl.address,
        proxyAdmin.address,
        iface.encodeFunctionData("init", args) // init args
      ]
    );

    console.log(`deployed transparent proxy for ${artifact} to ${p.address} with owner ${proxyAdmin.address}, args ${args}`);

    return p;
  };

  const registry = await deployTProxyArtifact(
    "Registry",
    "function init(address)",
    operatorAddr
  );

  const executor = await deployTProxyArtifact(
    "Executor",
    "function init(address,address,address)",
    operatorAddr,
    emergencyCouncilAddr,
    registry.addr
  );

  // we set the owner to the sender, then set it up to use the zero
  // liquidityprovider, then point the provider to the
  // stupidliquidityprovider, then set the owner to the operator if it's
  // different from the sender's address

  const fusdc = await deployTProxyArtifact(
    "Token",
    "function init(address,address,string,string,address,address,address)",
    ethers.constants.AddressZero, // liquidity provider
    6, // decimals
    "Fluid USDC", // name
    "fUSDC", // symbol
    emergencyCouncilAddr, // emergency council
    senderAddr, // operator
    executor.address // oracle
  );

  const stupidLiquidityProvider = await deployTProxyArtifact(
    "StupidLiquidityProvider",
    "function init(address,address)",
    USDC_ADDR,
    fusdc.address
  );

  console.log("about to upgrade the liquidity provider");

  await fusdc.upgradeLiquidityProvider(stupidLiquidityProvider.address, 0);

  if (senderAddr.toLowerCase() != operatorAddr.toLowerCase()) {
    console.log("sender is different from the operator, so changing the owner to the operator");
    await fusdc.updateOperator(operatorAddr);
  } else {
    console.log("sender is the same as the operator so not changing the owner");
  }
};

main().then(_ => {});
