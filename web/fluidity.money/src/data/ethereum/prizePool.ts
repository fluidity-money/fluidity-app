import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { BigNumber } from "ethers";
import { Contract, ContractInterface } from "ethers";
import BN from "big.js";

import PrizePoolABI from "./prizePoolABI.json";

type ErrorType = {
  data: { message: string };
} & { message: string };

const handleContractErrors = async (
  error: ErrorType,
  provider: Provider | undefined
) => {
  const msg = error?.data?.message ?? error?.message;

  if (!msg) throw new Error(`Unknown Error: ${error}`);

  // check for denial separately (these don't contain an error code for some reason)
  if (msg === "MetaMask Tx Signature: User denied transaction signature.") {
    throw new Error(`Transaction Denied`);
  }

  try {
    // check if we've got a different metamask error
    const metaMaskError = JSON.parse(msg.match(/{.*}/)?.[0] || "");

    if (metaMaskError?.value.code === -32603) {
      throw new Error(
        `Failed to make swap. Please reset your Metamask account (settings -> advanced -> reset account)`
      );
    } else if (metaMaskError?.value.code === -32000) {
      throw new Error(`Failed to make swap. Gas limit too low.`);
    }

    // otherwise, check for a 'non intrinsic' gas error (gas exhausted)
    const { hash } = metaMaskError || {};
    const receipt = await provider?.getTransactionReceipt(hash);
    // found revert opcode, assume it's a gas error since we can't call this with an insufficient balance within the application
    if (receipt?.status === 0) {
      throw new Error(
        `Failed to make swap. Gas limit of ${receipt?.gasUsed?.toNumber()} exhausted!`
      );
    }
  } catch (e) {
    // otherwise, use a generic error
    throw new Error(`Failed to make swap. ${msg}`);
  }
};

type PrizePool = {
  amount: BigNumber;
  decimals: number;
};

// Returns total prize pool from aggregated contract
export const getEthTotalPrizePool = async (
  rpcUrl: string
): Promise<number> => {
  const provider = new JsonRpcProvider(rpcUrl);
  const poolAddress: string = "0xD3E24D732748288ad7e016f93B1dc4F909Af1ba0";
  const poolABI: ContractInterface = PrizePoolABI;

  try {
    const rewardPoolContract = new Contract(
      poolAddress,
      poolABI,
      provider
    );

    if (!rewardPoolContract)
      throw new Error(`Could not instantiate Reward Pool at ${poolAddress}`);

    const pools: PrizePool[] = await rewardPoolContract.callStatic.getPools();

    const totalPrizePool = pools.reduce((sum, { amount, decimals }) => {
      // amount is uint256, convert to proper BN for float calculations
      const amountBn = new BN(amount.toString());
      const decimalsBn = new BN(10).pow(decimals);
      const amountDiv = amountBn.div(decimalsBn);

      return sum.add(amountDiv);
    }, new BN(0));

    return totalPrizePool.toNumber();
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return 0;
  }
};