import { JsonRpcProvider, JsonRpcSigner, Provider } from "@ethersproject/providers";
import { ContractTransaction } from "@ethersproject/contracts";
import { utils, BigNumber, constants } from "ethers";
import { Signer, Contract, ContractInterface } from "ethers";
import BN from "bn.js";
import { bytesToHex } from "web3-utils";
import { B64ToUint8Array, jsonPost, getChainId } from "~/util";
import { TransactionResponse } from "../instructions";

const ArbitrumChainId = getChainId("arbitrum");

export type ContractToken = {
  address: string;
  ABI: ContractInterface;
  symbol: string;
  isFluidOf: boolean;
};

export const signOwnerAddress_ = async (
  owner: string,
  signer: Signer,
  contractAddress: string,
  ABI: ContractInterface
) => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) throw new Error("Invalid contract provided!");

  const address = await signer.getAddress();
  const msg = await signer.signMessage(
    utils.arrayify(
      utils.keccak256(
        utils.solidityPack(
          ["string", "address", "address"],
          ["fluidity.lootbox.confirm.address.ownership", address, owner]
        )
      )
    )
  );

  return msg;
};

export const confirmAccountOwnership_ = async (
  signature: string,
  address: string,
  signer: Signer,
  contractAddress: string,
  ABI: ContractInterface
): Promise<TransactionResponse> => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) throw new Error("Invalid contract provided!");

  const owner = await signer.getAddress();
  const { v, r, s } = utils.splitSignature(signature);

  try {
    return await contract.confirm(address, owner, v, r, s);
  } catch (error) {
    throw new Error(`Could not claim testnet address. ${error}`);
  }
};

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
): Promise<BN> => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) return new BN(0);

  const userAddress = await signer.getAddress();

  return new BN((await contract.balanceOf(userAddress)).toString());
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
      return await toContract.erc20In(amount);
    } else if (fromIsFluidOf) {
      // fCoin -> Coin
      return await fromContract.erc20Out(amount);
    } else throw new Error(`Invalid token pair ${from.symbol}:${to.symbol}`);
  } catch (error) {
    return await handleContractErrors(error as ErrorType, signer.provider);
  }
};

type ManualRewardBody = {
  // Address of initiator
  address: string;

  // Name of Token being front-run
  token_short_name: string;
};

type ManualRewardRes = {
  // Error message on unsuccessful call
  error?: string;

  // Base64 encoded signature for calling
  // manual-reward in Token.sol
  payload?: {
    reward: {
      winner: string;
      win_amount: number;
      first_block: number;
      last_block: number;
      token_details: {
        token_decimals: number;
        token_short_name: string;
      };
    };
    signature: string;
  };
};

export const manualRewardToken = async (
  token: ContractToken,
  baseTokenSymbol: string,
  address: string,
  signer: Signer
): Promise<
  { amount: number; gasFee: number; networkFee: number } | undefined
> => {
  const manualRewardUrl = "https://api.ethereum.fluidity.money/manual-reward";

  const manualRewardBody = {
    address,
    token_short_name: baseTokenSymbol,
  };

  const { error, payload } = await jsonPost<ManualRewardBody, ManualRewardRes>(
    manualRewardUrl,
    manualRewardBody
  );

  if (error || !payload) return;

  // Call eth contract

  const { winner, win_amount, first_block, last_block, token_details } =
    payload.reward;

  const { token_decimals } = token_details;
  const decimals = BigNumber.from(10).pow(token_decimals);

  const winningAmount = BigNumber.from(`${win_amount}`);

  const { signature: b64Signature } = payload;

  // convert B64 -> byte[] -> hex string
  const uint8Signature = B64ToUint8Array(b64Signature);
  const hexSignature = bytesToHex(Array.from(uint8Signature));

  const mainnetId = 1;

  try {
    const tokenContract = getContract(token.ABI, token.address, signer);

    const contractTx: ContractTransaction = await tokenContract.manualReward(
      // contractAddress
      token.address,
      // chainid
      mainnetId,
      // winnerAddress
      winner,
      // winAmount
      winningAmount,
      // firstBlock
      first_block,
      // lastBlock
      last_block,
      // sig
      hexSignature
    );

    const res = await contractTx.wait();

    return {
      networkFee: res.gasUsed.toNumber(),
      gasFee: res.gasUsed.toNumber(),
      amount: parseFloat(winningAmount.div(decimals).toString()),
    };
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return { amount: 0, gasFee: 0, networkFee: 0 };
  }
};

type PrizePool = {
  amount: BigNumber;
  decimals: number;
};

// Returns total prize pool from aggregated contract
export const aggregatePrizePools = async (
  provider: JsonRpcProvider,
  rewardPoolAddr: string,
  rewardPoolAbi: ContractInterface
): Promise<number> => {
  try {
    const rewardPoolContract = new Contract(
      rewardPoolAddr,
      rewardPoolAbi,
      provider
    );

    if (!rewardPoolContract)
      throw new Error(`Could not instantiate Reward Pool at ${rewardPoolAddr}`);

    const pools: PrizePool[] = await rewardPoolContract.callStatic.getPools();

    const totalPrizePool = pools.reduce((sum, { amount, decimals }) => {
      // amount is uint256, convert to proper BN for float calculations
      const amountBn = new BN(amount.toString());

      const decimalsBn = new BN(10).pow(new BN(decimals));

      const amountDiv = amountBn.div(decimalsBn);

      return sum.add(amountDiv);
    }, new BN(0));

    return totalPrizePool.toNumber();
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return 0;
  }
};

// Returns total prize pool from aggregated contract
export const getTotalRewardPool = async (
  provider: JsonRpcProvider,
  rewardPoolAddr: string,
  rewardPoolAbi: ContractInterface
): Promise<number> => {
  try {
    const rewardPoolContract = new Contract(
      rewardPoolAddr,
      rewardPoolAbi,
      provider
    );

    if (!rewardPoolContract)
      throw new Error(`Could not instantiate Reward Pool at ${rewardPoolAddr}`);

    const totalPrizePool_ =
      await rewardPoolContract.callStatic.getTotalRewardPool();

    const totalPrizePool = new BN(totalPrizePool_.toString());

    const DECIMALS = new BN(18);

    const decimalsBn = new BN(10).pow(DECIMALS);

    return totalPrizePool.div(decimalsBn).toNumber();
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return 0;
  }
};

export type StakingRatioRes = {
  fusdcUsdcRatio: BigNumber;
  fusdcWethRatio: BigNumber;
  fusdcUsdcSpread: BigNumber;
  fusdcWethSpread: BigNumber;
};

export const getTokenStakingRatio = async (
  provider: JsonRpcProvider,
  stakingAbi: ContractInterface,
  stakingAddr: string
) => {
  try {
    const stakingContract = new Contract(stakingAddr, stakingAbi, provider);

    if (!stakingContract)
      throw new Error(
        `Could not instantiate Staking Contract at ${stakingAddr}`
      );

    return stakingContract.ratios();
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return undefined;
  }
};

export type StakingDepositsRes = Array<{
  depositTimestamp: BigNumber;
  redeemTimestamp: BigNumber;
  camelotLpMinted: BigNumber;
  camelotTokenA: BigNumber;
  camelotTokenB: BigNumber;
  sushiswapLpMinted: BigNumber;
  sushiswapTokenA: BigNumber;
  sushiswapTokenB: BigNumber;
  fusdcUsdcPair: boolean;
}>;

export const getUserStakingDeposits = async (
  provider: JsonRpcProvider,
  stakingAbi: ContractInterface,
  stakingAddr: string,
  userAddr: string
): Promise<StakingDepositsRes | undefined> => {
  try {
    const stakingContract = new Contract(stakingAddr, stakingAbi, provider);

    if (!stakingContract)
      throw new Error(
        `Could not instantiate Staking Contract at ${stakingAddr}`
      );

    const deposits = await stakingContract.deposits(userAddr);

    return deposits;
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return undefined;
  }
};

// Call Static Stake tokens - For Error Checking
export const testMakeStakingDeposit = async (
  signer: Signer,
  stakingAbi: ContractInterface,
  stakingAddr: string,
  lockDurationSeconds: BN,
  usdcAmt: BN,
  fusdcAmt: BN,
  wethAmt: BN,
  slippage: BN,
  maxTimestamp: BN
) => {
  const stakingContract = getContract(stakingAbi, stakingAddr, signer);

  if (!stakingContract)
    throw new Error(`Could not instantiate Staking Contract at ${stakingAddr}`);

  // call deposit
  return await stakingContract.callStatic.deposit(
    lockDurationSeconds.toString(),
    fusdcAmt.toString(),
    usdcAmt.toString(),
    wethAmt.toString(),
    slippage.toString(),
    maxTimestamp.toString()
  );
};
// Stake tokens
export const makeStakingDeposit = async (
  signer: Signer,
  usdcToken: ContractToken,
  fusdcToken: ContractToken,
  wethToken: ContractToken,
  stakingAbi: ContractInterface,
  stakingAddr: string,
  lockDurationSeconds: BN,
  usdcAmt: BN,
  fusdcAmt: BN,
  wethAmt: BN,
  slippage: BN,
  maxTimestamp: BN
) => {
  try {
    const stakingContract = getContract(stakingAbi, stakingAddr, signer);

    if (!stakingContract)
      throw new Error(
        `Could not instantiate Staking Contract at ${stakingAddr}`
      );

    const stakingTokenAmounts = [
      {
        token: usdcToken,
        amt: usdcAmt,
      },
      {
        token: fusdcToken,
        amt: fusdcAmt,
      },
      {
        token: wethToken,
        amt: wethAmt,
      },
    ];

    // Check whether to increase allowance
    await Promise.all(
      stakingTokenAmounts.map(async ({ token: { ABI, address }, amt }) => {
        const tokenContract = getContract(ABI, address, signer);

        const allowance: BigNumber = await tokenContract.allowance(
          address,
          stakingAddr
        );

        const amtString = amt.toString();

        if (allowance.lt(amtString)) {
          const approval = await tokenContract.approve(stakingAddr, amtString);

          // `.wait()` to handle errors
          await approval.wait();
        }
      })
    );

    // call deposit
    return await stakingContract.deposit(
      lockDurationSeconds.toString(),
      fusdcAmt.toString(),
      usdcAmt.toString(),
      wethAmt.toString(),
      slippage.toString(),
      maxTimestamp.toString()
    );
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return undefined;
  }
};

export type StakingRedeemableRes = {
  fusdcRedeemable: BN;
  usdcRedeemable: BN;
  wethRedeemable: BN;
};

export const getRedeemableTokens = async (
  signer: Signer,
  stakingAbi: ContractInterface,
  stakingAddr: string,
  address: string
): Promise<StakingRedeemableRes | undefined> => {
  try {
    const stakingContract = getContract(stakingAbi, stakingAddr, signer);

    if (!stakingContract)
      throw new Error(
        `Could not instantiate Staking Contract at ${stakingAddr}`
      );

    // call redeemable
    return await stakingContract.redeemable(address);
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
  }
};

export const makeStakingRedemption = async (
  signer: Signer,
  stakingAbi: ContractInterface,
  stakingAddr: string,
  timestamp: BN,
  fusdcMinimum: BN,
  usdcMinimum: BN,
  wethMinimum: BN
) => {
  try {
    const stakingContract = getContract(stakingAbi, stakingAddr, signer);

    if (!stakingContract)
      throw new Error(
        `Could not instantiate Staking Contract at ${stakingAddr}`
      );

    // call redeem
    return await stakingContract.redeem(
      timestamp.toString(),
      fusdcMinimum.toString(),
      usdcMinimum.toString(),
      wethMinimum.toString()
    );
  } catch (error) {
    return await handleContractErrors(error as ErrorType, signer.provider);
  }
};

export const getWethUsdPrice = async (
  provider: JsonRpcProvider,
  eacAggregatorProxyAddr: string,
  eacAggregatorProxyAbi: ContractInterface
): Promise<number> => {
  try {
    const eacAggregatorProxyContract = new Contract(
      eacAggregatorProxyAddr,
      eacAggregatorProxyAbi,
      provider
    );

    if (!eacAggregatorProxyContract)
      throw new Error(
        `Could not instantiate EACAggregator at ${eacAggregatorProxyAddr}`
      );

    const wethUsdValue_ =
      await eacAggregatorProxyContract.callStatic.latestAnswer();

    const wethUsdValue = new BN(wethUsdValue_.toString());

    // Convert to cents, for more accurate calculations
    const CENT_DECIMALS = new BN(6);

    const decimalsBn = new BN(10).pow(CENT_DECIMALS);

    return wethUsdValue.div(decimalsBn).toNumber() / 100;
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);

    return 0;
  }
};

export const merkleDistributorWithDeadlineEndTime = async (
  provider: JsonRpcProvider,
  merkleDistributorWithDeadlineAddr: string,
  merkleDistributorWithDeadlineAbi: ContractInterface
) => {
  try {
    const merkleDistributorWithDeadlineContract = new Contract(
      merkleDistributorWithDeadlineAddr,
      merkleDistributorWithDeadlineAbi,
      provider
    );

    if (!merkleDistributorWithDeadlineContract)
      throw new Error(
        `Could not instantiate MerkleDistributorWithDeadline at ${merkleDistributorWithDeadlineAddr}`
      );

    const endTime =
      await merkleDistributorWithDeadlineContract.callStatic.endTime();

    return endTime;
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);

    return 0;
  }
};

export const merkleDistributorWithDeadlineClaim = async (
  signer: Signer,
  merkleDistributorWithDeadlineAddr: string,
  merkleDistributorWithDeadlineAbi: ContractInterface,
  index: number,
  amount: BN,
  merkleProof: string[]
) => {
  try {
    const merkleDistributorWithDeadlineContract = new Contract(
      merkleDistributorWithDeadlineAddr,
      merkleDistributorWithDeadlineAbi,
      signer
    );

    if (!merkleDistributorWithDeadlineAddr)
      throw new Error(
        `Could not instantiate MerkleDistributorWithDeadline at ${merkleDistributorWithDeadlineAddr}`
      );

      await merkleDistributorWithDeadlineContract.claim(
        index,
        amount.toString(),
        merkleProof
      );

      return true;
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return false;
  }
};

export const merkleDistributorWithDeadlineClaimAndStake = async (
  signer: Signer,
  merkleDistributorWithDeadlineAddr: string,
  merkleDistributorWithDeadlineAbi: ContractInterface,
  index: number,
  amount: BN,
  merkleProof: string[]
) => {
  try {
    const merkleDistributorWithDeadlineContract = new Contract(
      merkleDistributorWithDeadlineAddr,
      merkleDistributorWithDeadlineAbi,
      signer
    );

    if (!merkleDistributorWithDeadlineAddr)
      throw new Error(
        `Could not instantiate MerkleDistributorWithDeadline at ${merkleDistributorWithDeadlineAddr}`
      );

    await merkleDistributorWithDeadlineContract.callStatic.claimAndStake(
      index,
      amount.toString(),
      merkleProof
    );

    await merkleDistributorWithDeadlineContract.claimAndStake(
      index,
      amount.toString(),
      merkleProof
    );

    return true;
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return false;
  }
};

export const merkleDistributorWithDeadlineIsClaimed = async (
  provider: Provider,
  merkleDistributorWithDeadlineAddr: string,
  merkleDistributorWithDeadlineAbi: ContractInterface,
  index: number
) => {
  try {
    const merkleDistributorWithDeadlineContract = new Contract(
      merkleDistributorWithDeadlineAddr,
      merkleDistributorWithDeadlineAbi,
      provider
    );

    if (!merkleDistributorWithDeadlineAddr)
      throw new Error(
        `Could not instantiate MerkleDistributorWithDeadline at ${merkleDistributorWithDeadlineAddr}`
      );

    return await merkleDistributorWithDeadlineContract.isClaimed(index);
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return false;
  }
};

export const flyStakingStake = async (
  signer: JsonRpcSigner,
  flyTokenAddr: string,
  flyTokenAbi: ContractInterface,
  flyStakingAddr: string,
  flyStakingAbi: ContractInterface,
  amount: BN
) => {
  try {
    const { provider } = signer;

    const signerAddr = await signer.getAddress();

    const flyStakingContract = new Contract(flyStakingAddr, flyStakingAbi, signer);

    if (!flyStakingContract)
      throw new Error(`Could not instantiate FLYStakingV1 at ${flyStakingAddr}`);

    const flyTokenContract = new Contract(flyTokenAddr, flyTokenAbi, provider);

    if (!flyTokenContract)
      throw new Error(`Could not instantiate FlyToken at ${flyTokenAddr}`);

    console.log("about to get nonces");

    const nonce = await flyTokenContract.nonces(signerAddr);

    console.log("got nonce", nonce);

    const deadline = Date.now() + (60 * 120); // 2 hours in the future

    const sig = await signer._signTypedData(
      {
        name: "Fluidity", // FLY name
        version: "1",
        chainId: ArbitrumChainId, // arbitrum chain id
        verifyingContract: flyTokenAddr
      },
      {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ]
      },
      {
        owner: signerAddr,
        spender: flyStakingAddr,
        value: "0x" + amount.toString(16),
        nonce: nonce,
        deadline: deadline
      }
    );

    console.log("got sig", sig);

    const { r, s, v } = utils.splitSignature(sig);

    console.log("about to call the stake permit function");

    await flyStakingContract.stakePermit(
      amount.toString(), // fly amount
      deadline,
      v,
      r,
      s
    );

    return true;
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return false;
  }
};

export type FLYStakingDetailsRes = {
  flyStaked: BigNumber;
  points: BigNumber;
}

export const flyStakingDetails = async (
  provider: Provider,
  flyStakingAddr: string,
  flyStakingAbi: ContractInterface,
  address: string
):  Promise<FLYStakingDetailsRes | undefined>=> {
  try {
    const flyStakingContract = new Contract(flyStakingAddr, flyStakingAbi, provider);

    if (!flyStakingContract)
      throw new Error(`Could not instantiate FLYStakingV1 at ${flyStakingAddr}`);

    return await flyStakingContract.stakingDetails(address);
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return undefined;
  }
};

export const flyStakingBeginUnstake = async (
  signer: Signer,
  flyStakingAddr: string,
  flyStakingAbi: ContractInterface,
  flyToUnstake: BN
) => {
  try {
    const flyStakingContract = new Contract(flyStakingAddr, flyStakingAbi, signer);

    if (!flyStakingContract)
      throw new Error(`Could not instantiate FLYStakingV1 at ${flyStakingAddr}`);

    await flyStakingContract.beginUnstake(flyToUnstake.toString());

    return true;
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return false;
  }
};

export const flyStakingSecondsUntilSoonestUnstake = async (
  provider: Provider,
  flyStakingAddr: string,
  flyStakingAbi: ContractInterface,
  address: string
):  Promise<BigNumber | undefined> => {
  try {
    const flyStakingContract = new Contract(flyStakingAddr, flyStakingAbi, provider);

    if (!flyStakingContract)
      throw new Error(`Could not instantiate FLYStakingV1 at ${flyStakingAddr}`);

    return await flyStakingContract.secondsUntilSoonestUnstake(address);
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return undefined;
  }
};

export const flyStakingFinaliseUnstake = async (
  signer: Signer,
  flyStakingAddr: string,
  flyStakingAbi: ContractInterface
): Promise<BigNumber | undefined> => {
  try {
    const flyStakingContract = new Contract(flyStakingAddr, flyStakingAbi, signer);

    if (!flyStakingContract)
      throw new Error(`Could not instantiate FLYStakingV1 at ${flyStakingAddr}`);

    const amount = await flyStakingContract.callStatic.finaliseUnstake();

    await flyStakingContract.finaliseUnstake();

    return amount;
  } catch (error) {
    await handleContractErrors(error as ErrorType, signer.provider);
    return undefined;
  }
};

export const flyStakingAmountUnstaking = async (
  provider: Provider,
  flyStakingAddr: string,
  flyStakingAbi: ContractInterface,
  address: string
):  Promise<BigNumber | undefined>=> {
  try {
    const flyStakingContract = new Contract(flyStakingAddr, flyStakingAbi, provider);

    if (!flyStakingContract)
      throw new Error(`Could not instantiate FLYStakingV1 at ${flyStakingAddr}`);

    return await flyStakingContract.amountUnstaking(address);
  } catch (error) {
    await handleContractErrors(error as ErrorType, provider);
    return undefined;
  }
};

type ErrorType = {
  data: { message: string };
} & { message: string };

export const handleContractErrors = async (
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
        `RPC error. Please reset your Metamask account (settings -> advanced -> reset account)`
      );
    } else if (metaMaskError?.value.code === -32000) {
      throw new Error(`RPC error. Gas limit too low.`);
    }

    // otherwise, check for a 'non intrinsic' gas error (gas exhausted)
    const { hash } = metaMaskError || {};
    const receipt = await provider?.getTransactionReceipt(hash);
    // found revert opcode, assume it's a gas error since we can't call this with an insufficient balance within the application
    if (receipt?.status === 0) {
      throw new Error(
        `RPC error. Gas limit of ${receipt?.gasUsed?.toNumber()} exhausted!`
      );
    }
  } catch (e) {
    // otherwise, use a generic error
    throw new Error(`RPC error. ${msg}`);
  }
};

export default makeContractSwap;
