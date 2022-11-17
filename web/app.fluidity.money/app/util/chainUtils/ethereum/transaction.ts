import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { utils, BigNumber, constants } from "ethers";
import { Signer, Contract, ContractInterface } from "ethers";

export const getContract = (
  ABI: ContractInterface,
  address: string,
  signer?: Signer
) => {
  return new Contract(address, ABI, signer);
};

//get ERC20 balance for the given token
export const getBalanceOfERC20 = async (
  signer: Signer,
  contractAddress: string,
  ABI: ContractInterface
) => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) return "0";
  const userAddress = await signer.getAddress();
  return (await contract.balanceOf(userAddress)).toString();
};

// get ERC20 balance for the given token, divided by its decimals
export const usdBalanceOfERC20 = async (
  signer: Signer,
  contractAddress: string,
  ABI: ContractInterface
): Promise<number> => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) return 0;

  const userAddress = await signer.getAddress();
  const balance = (await contract.balanceOf(userAddress)).toString();
  const decimals = (await contract.decimals()).toString();

  return Number(utils.formatUnits(balance, decimals));
};

// whether the per-user mint limit is enabled for the contract
export const userMintLimitedEnabled = async (
  provider: JsonRpcProvider,
  contractAddress: string,
  ABI: ContractInterface
): Promise<boolean> => {
  const contract = new Contract(contractAddress, ABI, provider);
  if (!contract) return false;

  try {
    return await contract.mintLimitsEnabled();
  } catch (e) {
    console.error(e);
  }
  return false;
};

// the user mint limit for the contract, regardless of whether it's enabled
export const getUserMintLimit = async (
  provider: JsonRpcProvider,
  contractAddress: string,
  ABI: ContractInterface
): Promise<string> => {
  const contract = new Contract(contractAddress, ABI, provider);
  if (!contract) return "0";
  return (await contract.userMintLimit()).toString();
};

// the user mint limit for the contract scaled by decimals, regardless of whether it's enabled
export const getUsdUserMintLimit = async (
  provider: JsonRpcProvider,
  contractAddress: string,
  ABI: ContractInterface
): Promise<number> => {
  const contract = new Contract(contractAddress, ABI, provider);
  if (!contract) return 0;

  const limit = (await contract.userMintLimit()).toString();
  const decimals = (await contract.decimals()).toString();

  return Number(utils.formatUnits(limit, decimals));
};

// the amount towards the mint limit the given user has currently minted
export const getAmountMinted = async (
  provider: JsonRpcProvider,
  contractAddress: string,
  ABI: ContractInterface,
  userAddress: string
): Promise<string> => {
  const contract = new Contract(contractAddress, ABI, provider);
  if (!contract) return "0";
  return (await contract.userAmountMinted(userAddress)).toString();
};

// the amount towards the mint limit the given user has currently minted scaled by decimals
export const getUsdAmountMinted = async (
  provider: JsonRpcProvider,
  contractAddress: string,
  ABI: ContractInterface,
  userAddress: string
): Promise<number> => {
  const contract = new Contract(contractAddress, ABI, provider);
  if (!contract)
    throw new Error(`Could not instantiate contract ${contractAddress}`);

  const amount = (await contract.userAmountMinted(userAddress)).toString();
  const decimals = (await contract.decimals()).toString();

  return Number(utils.formatUnits(amount, decimals));
};

export type ContractToken = {
  address: string;
  ABI: ContractInterface;
  symbol: string;
  isFluidOf: boolean;
};

const makeContractSwap = async (
  signer: Signer,
  from: ContractToken,
  to: ContractToken,
  amount: string | number
) => {
  const { address: fromAddress, ABI: fromABI, isFluidOf: fromIsFluidOf } = from;
  const { address: toAddress, ABI: toABI, isFluidOf: toIsFluidOf } = to;

  const fromContract = getContract(fromABI, fromAddress, signer);
  const toContract = getContract(toABI, toAddress, signer);
  const amountBn = utils.parseUnits(String(amount));

  if (amountBn.eq(0)) {
    throw new Error(`Cannot send 0 ${from.symbol}!`);
  }
  if (amountBn.lt(0)) {
    throw new Error(`${amount} is less than 0!`);
  }

  try {
    const fromAddress = await signer.getAddress();
    const balance: BigNumber = await fromContract.balanceOf(fromAddress);
    if (balance.lt(amount)) {
      throw new Error(`You don't have enough ${from.symbol}`);
    }

    if (toIsFluidOf) {
      //Coin -> fCoin
      //call approve
      //check whether to increase allowance - if it already exists this will fail
      const allowance: BigNumber = await fromContract.allowance(
        fromAddress,
        toAddress
      );
      // some tokens (USDT) will revert if approving from nonzero -> nonzero, to prevent reordering attacks
      if (allowance.lt(amount)) {
        if (!allowance.isZero()) {
          const zeroApproval = await fromContract.approve(
            toContract.address,
            constants.Zero
          );
          await zeroApproval.wait();
        }

        const approval = await fromContract.approve(
          toContract.address,
          constants.MaxUint256
        );
        await approval.wait();
      }
      // `.wait()` these here to handle errors
      // call ERC20in
      return await (await toContract.erc20In(amount)).wait();
    } else if (fromIsFluidOf) {
      // fCoin -> Coin
      return await (await fromContract.erc20Out(amount)).wait();
    } else throw new Error(`Invalid token pair ${from.symbol}:${to.symbol}`);
  } catch (error) {
    return await handleContractErrors(error as ErrorType, signer.provider);
  }
};

type ErrorType = {
  data: { message: string };
} & { message: string };

export const handleContractErrors = async (
  error: ErrorType,
  provider: Provider | undefined
) => {
  const msg: string = error?.data?.message ?? error?.message;
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

export default makeContractSwap;
