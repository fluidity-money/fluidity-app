import {ethers, Signer} from "ethers";
import {Provider} from "ethers/providers";
import {SupportedContracts} from 'util/contractList';
import {getContract} from "./contractUtils";
import {decimalTrim} from "./decimalTrim";

export const handleContractErrors = async(error: any, addError: (error: string) => void, provider: Provider | undefined) => {
    const msg: string = error.data?.message ?? error.message;
    // check for denial separately (these don't contain an error code for some reason)
    if (msg === "MetaMask Tx Signature: User denied transaction signature.") {
        addError(`Transaction Denied`);
        return;
    }
    try {
        // check if we've got a different metamask error
        const metaMaskError = JSON.parse(msg.match(/{.*}/)?.[0] || "");

        if (metaMaskError?.value.code === -32603) {
            addError(`Failed to make swap. Please reset your Metamask account (settings -> advanced -> reset account)`);
            return;
        }

        else if (metaMaskError?.value.code === -32000) {
            addError(`Failed to make swap. Gas limit too low.`);
            return;
        }

        // otherwise, check for a 'non intrinsic' gas error (gas exhausted)
        const {hash} = metaMaskError || {};
        const receipt = await provider?.getTransactionReceipt(hash);
        // found revert opcode, assume it's a gas error since we can't call this with an insufficient balance within the application
        if (receipt?.status === 0) {
            addError(`Failed to make swap. Gas limit of ${receipt?.gasUsed?.toNumber()} exhausted!`);
            return;
        }
    } catch (e) {
        // otherwise, use a generic error
        addError(`Failed to make swap. ${msg}`);
    }
}

const makeContractSwap = async (type: 'toFluid' | 'fromFluid', tokenAmount: string, contractName: SupportedContracts, signer: Signer | null, addError: (error: string) => void) => {
    if (!signer) return;
    if (!tokenAmount) return;

    const tokenContract = getContract('ETH', contractName, signer);
    const fluidContract = getContract('ETH', `f${contractName}`, signer);

    if (!tokenContract || !fluidContract) return;
    // const decimals = await fluidContract.decimals();
    const amountTrimmed = decimalTrim(tokenAmount, 7);

    //6 decimals for USDT (should be put in contractList if variable for tokens that are used, to avoid needing to pass in an extra value)
    const amount = ethers.utils.parseUnits(amountTrimmed, 6)
    const TOKEN_MAX = (10 ** 18).toString()

    if (amount.lte(0) || amount.gt(TOKEN_MAX)) return;

    try {
        const addr = await signer.getAddress();
        const spendingToken = type === 'toFluid' ? tokenContract : fluidContract;
        const balance: ethers.utils.BigNumber = await spendingToken.balanceOf(addr);
        if (balance.lt(amount)) {
            addError(`You don't have enough ${type === 'toFluid' ? contractName : "f" + contractName}`);
            return;
        }
        if (type === 'toFluid') {
            //Coin -> fCoin
            //call USDT approve
            //check whether to increase allowance - if it already exists this will fail
            let allowance: ethers.utils.BigNumber = await tokenContract.allowance(addr, fluidContract.address)
            // some tokens (USDt) will revert if approving from nonzero -> nonzero, to prevent reordering attacks
            if (allowance.lt(amount)) {
                if (!allowance.isZero()) {
                    const zeroApproval = await tokenContract.approve(fluidContract.address, ethers.constants.Zero);
                    await zeroApproval.wait();
                }

                const approval = await tokenContract.approve(fluidContract.address, ethers.constants.MaxUint256);
                await approval.wait();
            }
            // `.wait()` these here to handle errors
            // call fUSDT ERC20in
            return await (await fluidContract.erc20In(amount)).wait();
        } else {
            // fCoin -> Coin
            return await (await fluidContract.erc20Out(amount)).wait();
        }
    } catch (error) {
        return await handleContractErrors(error, addError, signer.provider);
    }
}

export default makeContractSwap;
