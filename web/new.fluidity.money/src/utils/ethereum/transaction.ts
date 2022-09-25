import {Contract, Signer, utils, constants} from "ethers";
import {Provider} from "ethers/providers";
import {EthereumToken} from "./token";

export const getContract =(signer: Signer, token: EthereumToken) => {
  const {address, ABI} = token;
  return new Contract(address, ABI, signer);
}

//get ERC20 balance for the given token
export const getBalanceOfERC20 = async(token: EthereumToken, signer: Signer) => {
    const contract = getContract(signer, token);
    if (!contract) return "0";
    const address = await signer.getAddress();
    return (await contract.balanceOf(address)).toString();
}

export const handleContractErrors = async(error: any, provider: Provider | undefined) => {
    const msg: string = error?.data?.message ?? error?.message;
    // check for denial separately (these don't contain an error code for some reason)
    if (msg === "MetaMask Tx Signature: User denied transaction signature.") {
        throw new Error(`Transaction Denied`);
    }
    try {
        // check if we've got a different metamask error
        const metaMaskError = JSON.parse(msg.match(/{.*}/)?.[0] || "");

        if (metaMaskError?.value.code === -32603) {
            throw new Error(`Failed to make swap. Please reset your Metamask account (settings -> advanced -> reset account)`);
        }

        else if (metaMaskError?.value.code === -32000) {
            throw new Error(`Failed to make swap. Gas limit too low.`);
        }

        // otherwise, check for a 'non intrinsic' gas error (gas exhausted)
        const {hash} = metaMaskError || {};
        const receipt = await provider?.getTransactionReceipt(hash);
        // found revert opcode, assume it's a gas error since we can't call this with an insufficient balance within the application
        if (receipt?.status === 0) {
            throw new Error(`Failed to make swap. Gas limit of ${receipt?.gasUsed?.toNumber()} exhausted!`);
        }
    } catch (e) {
        // otherwise, use a generic error
        throw new Error(`Failed to make swap. ${msg}`);
    }
}

const makeContractSwap = async(signer: Signer, fromToken: EthereumToken, toToken: EthereumToken, amount: string | number) => {
  const fromContract = getContract(signer, fromToken);
  const toContract = getContract(signer, toToken);
  const amountBn = utils.parseUnits(String(amount));

  if (amountBn.eq(0)) {
      throw new Error(`Cannot send 0 ${fromToken.symbol}!`);
  }
  if (amountBn.lt(0)) {
      throw new Error(`${amount} is less than 0!`);
  }

  try {
    const fromAddress = await signer.getAddress();
    // const spendingToken = type === 'toFluid' ? tokenContract : fluidContract;
    const balance: utils.BigNumber = await fromContract.balanceOf(fromAddress);
    if (balance.lt(amount)) {
        throw new Error(`You don't have enough ${fromToken.symbol}`);
    }
    if (fromToken.isUnwrapped() && toToken.isFluid()) {
        //Coin -> fCoin
        //call approve
        //check whether to increase allowance - if it already exists this will fail
        let allowance: utils.BigNumber = await fromContract.allowance(fromAddress, toToken.address)
        // some tokens (USDT) will revert if approving from nonzero -> nonzero, to prevent reordering attacks
        if (allowance.lt(amount)) {
            if (!allowance.isZero()) {
                const zeroApproval = await fromContract.approve(toContract.address, constants.Zero);
                await zeroApproval.wait();
            }

            const approval = await fromContract.approve(toContract.address, constants.MaxUint256);
            await approval.wait();
        }
        // `.wait()` these here to handle errors
        // call fUSDT ERC20in
        return await (await toContract.erc20In(amount)).wait();
    } else if (fromToken.isFluid() && toToken.isUnwrapped()) {
        // fCoin -> Coin
        return await (await fromContract.erc20Out(amount)).wait();
    } else throw new Error(`Invalid token pair ${fromToken.symbol}:${toToken.symbol}`)
  } catch (error) {
      return await handleContractErrors(error, signer.provider);
  }
}

export default makeContractSwap;
