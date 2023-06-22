import type Result from "~/types/Result";

import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
import { utils, BigNumber, constants } from "ethers";
import { Signer, Contract, ContractInterface } from "ethers";
import BN from "bn.js";
import { bytesToHex } from "web3-utils";
import { B64ToUint8Array, jsonPost } from "~/util";
import { Ok, Err, flatten, isOk } from "~/types/Result";
import { TransactionResponse } from "../instructions";

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
): Promise<Result<string, Error>> => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) return Err(new Error("Invalid contract provided!"));

  const address = Ok(await signer.getAddress());

  const message = address
    .map((address) =>
      utils.solidityPack(
        ["string", "address", "address"],
        ["fluidity.lootbox.confirm.address.ownership", address, owner]
      )
    )
    .map(utils.keccak256)
    .map(utils.arrayify);

  return message.match<Promise<Result<string, Error>>>({
    Ok: async (message) =>
      Ok(await signer.signMessage(message)).err((e) =>
        handleContractErrors(e, signer.provider)
      ),
    Err: async (err) => Err(err),
  });
};

export const confirmAccountOwnership_ = async (
  signature: string,
  address: string,
  signer: Signer,
  contractAddress: string,
  ABI: ContractInterface
): Promise<Result<TransactionResponse, Error>> => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) throw new Error("Invalid contract provided!");

  const owner = Ok(await signer.getAddress());

  return owner.match({
    Ok: async (owner) => {
      const { v, r, s } = utils.splitSignature(signature);

      return Ok(await contract.confirm(address, owner, v, r, s)).err((e) =>
        handleContractErrors(e, signer.provider)
      );
    },
    Err: async (e) => Err(e),
  });
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
): Promise<Result<BN, Error>> => {
  const contract = getContract(ABI, contractAddress, signer);

  if (!contract) return Err(Error("no contract"));

  const userAddress = Ok(await signer.getAddress());

  return userAddress.match({
    Ok: async (address) =>
      Ok(await contract.balanceOf(address))
        .map(toString)
        .map((str) => new BN(str))
        .err((e) => handleContractErrors(e, signer.provider)),
    Err: async (e) => Err(e),
  });
};

// get ERC20 balance for the given token, divided by its decimals
export const usdBalanceOfERC20 = async (
  signer: Signer,
  contractAddress: string,
  ABI: ContractInterface
): Promise<Result<number, Error>> => {
  const contract = getContract(ABI, contractAddress, signer);
  if (!contract) return Err(new Error("Could not get contract"));

  const userAddress = Ok(await signer.getAddress());

  const decimals = Ok(await contract.decimals()).map(toString);

  return flatten([userAddress, decimals]).match({
    Ok: async ([userAddress, decimals]) =>
      Ok(await contract.balanceOf(userAddress))
        .map((balance) => utils.formatUnits(balance, decimals))
        .map(toString)
        .map(Number),
    Err: async (e) => Err(e),
  });
};

// the amount towards the mint limit the given user has currently minted scaled by decimals
export const getUsdAmountMinted = async (
  provider: JsonRpcProvider,
  contractAddress: string,
  ABI: ContractInterface,
  userAddress: string
): Promise<Result<number, Error>> => {
  const contract = new Contract(contractAddress, ABI, provider);
  if (!contract)
    return Err(new Error(`Could not instantiate contract ${contractAddress}`));

  const amount = Ok(await contract.userAmountMinted(userAddress)).map(toString);
  const decimals = Ok(await contract.decimals()).map(toString);

  return flatten([amount, decimals]).match({
    Ok: async ([amount, decimals]) =>
      Ok(utils.formatUnits(amount, decimals)).map(Number),
    Err: async (e) => Err(e),
  });
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

  if (amountBn.eq(0)) return Err(new Error(`Cannot send 0 ${from.symbol}!`));
  if (amountBn.lt(0)) return Err(new Error(`${amount} is less than 0!`));

  if (!toIsFluidOf && !fromIsFluidOf)
    return Err(new Error(`Invalid token pair ${from.symbol}:${to.symbol}`));

  const signerAddress = Ok(await signer.getAddress()).err(
    () => `Could not get Signer Address`
  );

  const canSwap: Result<boolean, Error> = await signerAddress.match({
    Ok: async (address) =>
      Ok(await fromContract.balanceOf(address))
        .err(() => "Could not fetch balance")
        .map((balance) => balance.lt(amount)),
    Err: async (e) => Err(e),
  });

  if (!isOk(canSwap)) return canSwap;

  if (
    canSwap.match({
      Ok: (canSwap) => canSwap,
      Err: (_) => false,
    })
  )
    return Err(new Error(`You don't have enough ${from.symbol}`));

  if (toIsFluidOf) {
    //Coin -> fCoin
    //call approve
    //check whether to increase allowance - if it already exists this will fail
    const allowanceRes = Ok<BigNumber>(
      await fromContract.allowance(signerAddress, toAddress)
    );

    if (!isOk(allowanceRes)) return Err(new Error(`Could not fetch allowance`));

    const allowance = allowanceRes.match({
      Ok: (allowance) => allowance,
      Err: () => BigNumber.from(0), // Will not occur
    });

    const requireIncreaseAllowance = allowance.lt(amount);
    if (requireIncreaseAllowance) {
      if (!allowance.isZero()) {
        const zeroAllowance = Ok(
          await fromContract
            .approve(toContract.address, constants.Zero)
            .then((approval: ContractTransaction) => approval.wait())
        ).err((e) => handleContractErrors(e, signer.provider));

        if (!isOk(zeroAllowance)) return zeroAllowance;
      }

      const increaseAllowance = Ok(
        await fromContract
          .approve(toContract.address, constants.MaxUint256)
          .then((approval: ContractTransaction) => approval.wait())
      ).err((e) => handleContractErrors(e, signer.provider));

      if (!isOk(increaseAllowance)) return increaseAllowance;
    }

    const approval = Ok(
      await fromContract
        .approve(toContract.address, constants.MaxUint256)
        .then((approval: ContractTransaction) => approval.wait())
    ).err((e) => handleContractErrors(e, signer.provider));

    if (!isOk(approval)) return approval;

    // `.wait()` these here to handle errors
    // call ERC20in
    return Ok(await toContract.erc20In(amount)).err((e) =>
      handleContractErrors(e, signer.provider)
    );
  }

  // fCoin -> Coin
  return Ok(await fromContract.erc20Out(amount)).err((e) =>
    handleContractErrors(e, signer.provider)
  );
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
): Promise<Result<number, Error>> => {
  const rewardPoolContract = new Contract(
    rewardPoolAddr,
    rewardPoolAbi,
    provider
  );

  if (!rewardPoolContract)
    throw new Error(`Could not instantiate Reward Pool at ${rewardPoolAddr}`);

  const poolsRes: Result<PrizePool[], Error> = Ok(
    await rewardPoolContract.callStatic.getPools()
  );

  const totalPrizePool: Result<BN, Error> = poolsRes.map((pools) =>
    pools.reduce((sum, { amount, decimals }) => {
      // amount is uint256, convert to proper BN for float calculations
      const amountBn = new BN(amount.toString());

      const decimalsBn = new BN(10).pow(new BN(decimals));

      const amountDiv = amountBn.div(decimalsBn);

      return sum.add(amountDiv);
    }, new BN(0))
  );

  return totalPrizePool.map((prizePool) => prizePool.toNumber());
};

// Returns total prize pool from aggregated contract
export const getTotalRewardPool = async (
  provider: JsonRpcProvider,
  rewardPoolAddr: string,
  rewardPoolAbi: ContractInterface
): Promise<Result<number, Error>> => {
  const rewardPoolContract = new Contract(
    rewardPoolAddr,
    rewardPoolAbi,
    provider
  );

  if (!rewardPoolContract)
    return Err(
      new Error(`Could not instantiate Reward Pool at ${rewardPoolAddr}`)
    );

  const totalPrizePoolRes = Ok(
    await rewardPoolContract.callStatic.getTotalRewardPool()
  ).map((prizePool) => prizePool.toString());

  const DECIMALS = new BN(18);

  const decimalsBn = new BN(10).pow(DECIMALS);

  return totalPrizePoolRes.map((totalPrizePool) =>
    totalPrizePool.div(decimalsBn).toNumber()
  );
};

// Returns User DegenScore
export const getUserDegenScore = async (
  provider: JsonRpcProvider,
  userAddr: string,
  degenScoreAddr: string,
  degenScoreAbi: ContractInterface
): Promise<Result<number, Error>> => {
  const degenScoreContract = new Contract(
    degenScoreAddr,
    degenScoreAbi,
    provider
  );

  if (!degenScoreContract)
    return Err(
      new Error(`Could not instantiate DegenScore at ${degenScoreAddr}`)
    );

  const degenScoreTraitId = "121371448299756538184036965";

  return Ok(
    await degenScoreContract.callStatic.getTrait(userAddr, degenScoreTraitId, 0)
  ).map((score) => score.toNumber());
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
): Promise<Result<StakingRatioRes, Error>> => {
  const stakingContract = new Contract(stakingAddr, stakingAbi, provider);

  if (!stakingContract)
    return Err(
      new Error(`Could not instantiate Staking Contract at ${stakingAddr}`)
    );

  return Ok(await stakingContract.ratios()).err((e) =>
    handleContractErrors(e, provider)
  );
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
): Promise<Result<StakingDepositsRes, Error>> => {
  const stakingContract = new Contract(stakingAddr, stakingAbi, provider);

  if (!stakingContract)
    return Err(
      new Error(`Could not instantiate Staking Contract at ${stakingAddr}`)
    );

  return Ok(await stakingContract.deposits(userAddr)).err((e) =>
    handleContractErrors(e, provider)
  );
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
  const stakingContract = getContract(stakingAbi, stakingAddr, signer);

  if (!stakingContract)
    return Err(
      new Error(`Could not instantiate Staking Contract at ${stakingAddr}`)
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

  const allowances = flatten(
    await Promise.all(
      stakingTokenAmounts.map(async ({ token: { ABI, address }, amt }) => {
        const tokenContract = getContract(ABI, address, signer);

        if (!tokenContract)
          return Err(new Error(`Could not get token contract at ${address}`));

        const amtString = amt.toString();

        return (
          Ok(await tokenContract.allowance(address, stakingAddr))
            // Check whether to increase allowance
            .map((allowance) => allowance.lt(amtString))
            .match({
              Ok: async (shouldIncreaseAllowance) =>
                shouldIncreaseAllowance
                  ? Ok(
                      await tokenContract
                        .approve(stakingAddr, amtString)
                        .then((approval: ContractTransaction) =>
                          approval.wait()
                        )
                    ).err((e) => handleContractErrors(e, signer.provider))
                  : Ok(""),
              Err: async (e) => Err(e),
            })
        );
      })
    )
  );

  // call deposit
  return allowances
    .map(
      () =>
        await stakingContract.deposit(
          lockDurationSeconds.toString(),
          fusdcAmt.toString(),
          usdcAmt.toString(),
          wethAmt.toString(),
          slippage.toString(),
          maxTimestamp.toString()
        )
    )
    .err((e) => handleContractErrors(e, signer.provider));
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
): Promise<Result<StakingRedeemableRes, Error>> => {
  const stakingContract = getContract(stakingAbi, stakingAddr, signer);

  if (!stakingContract)
    return Err(
      new Error(`Could not instantiate Staking Contract at ${stakingAddr}`)
    );

  // call redeemable
  return Ok(await stakingContract.redeemable(address)).err((e) =>
    handleContractErrors(e, signer.provider)
  );
};

export const makeStakingRedemption = async (
  signer: Signer,
  stakingAbi: ContractInterface,
  stakingAddr: string,
  timestamp: BN,
  fusdcMinimum: BN,
  usdcMinimum: BN,
  wethMinimum: BN
): Promise<Result<TransactionResponse, Error>> => {
  const stakingContract = getContract(stakingAbi, stakingAddr, signer);

  if (!stakingContract)
    throw new Error(`Could not instantiate Staking Contract at ${stakingAddr}`);

  // call redeem
  return Ok(
    await stakingContract.redeem(
      timestamp.toString(),
      fusdcMinimum.toString(),
      usdcMinimum.toString(),
      wethMinimum.toString()
    )
  ).err((e) => handleContractErrors(e, signer.provider));
};

export const getWethUsdPrice = async (
  provider: JsonRpcProvider,
  eacAggregatorProxyAddr: string,
  eacAggregatorProxyAbi: ContractInterface
): Promise<Result<number, Error>> => {
  const eacAggregatorProxyContract = new Contract(
    eacAggregatorProxyAddr,
    eacAggregatorProxyAbi,
    provider
  );

  if (!eacAggregatorProxyContract)
    return Err(
      new Error(
        `Could not instantiate EACAggregator at ${eacAggregatorProxyAddr}`
      )
    );

  // Convert to cents, for more accurate calculations
  const CENT_DECIMALS = new BN(6);

  const decimalsBn = new BN(10).pow(CENT_DECIMALS);

  return Ok(await eacAggregatorProxyContract.callStatic.latestAnswer())
    .map(toString)
    .map((wethValue) => new BN(wethValue))
    .map((wethValue) => wethValue.div(decimalsBn).toNumber() / 100)
    .err((e) => handleContractErrors(e, provider));
};

type ErrorType = {
  data: { message: string };
} & { message: string };

export const handleContractErrors = async (
  error: ErrorType,
  provider: Provider | undefined
): Promise<Error> => {
  const msg = error?.data?.message ?? error?.message;

  try {
    if (!msg) return new Error(`Unknown Error: ${error}`);

    // check for denial separately (these don't contain an error code for some reason)
    if (msg === "MetaMask Tx Signature: User denied transaction signature.") {
      return new Error(`Transaction Denied`);
    }

    // check if we've got a different metamask error
    const metaMaskError = JSON.parse(msg.match(/{.*}/)?.[0] || "");

    if (metaMaskError?.value.code === -32603) {
      return new Error(
        `Failed to make swap. Please reset your Metamask account (settings -> advanced -> reset account)`
      );
    } else if (metaMaskError?.value.code === -32000) {
      return new Error(`Failed to make swap. Gas limit too low.`);
    }

    // otherwise, check for a 'non intrinsic' gas error (gas exhausted)
    const { hash } = metaMaskError || {};
    const receipt = await provider?.getTransactionReceipt(hash);

    // found revert opcode, assume it's a gas error since we can't call this with an insufficient balance within the application
    if (receipt?.status === 0) {
      return new Error(
        `Failed to make swap. Gas limit of ${receipt?.gasUsed?.toNumber()} exhausted!`
      );
    }
  } finally {
    // Unknown error - likely malformed call
    return new Error(`Failed to make swap. ${msg}`);
  }
};

export default makeContractSwap;
