import {utils} from "ethers";
import {Signer, Contract, ContractInterface} from "ethers";

export const getContract = (signer: Signer, address: string, ABI: ContractInterface) => {
  return new Contract(address, ABI, signer);
}

//get ERC20 balance for the given token
export const getBalanceOfERC20 = async(signer: Signer, contractAddress: string, ABI: ContractInterface) => {
    const contract = getContract(signer, contractAddress, ABI);
    if (!contract) return "0";
    const userAddress = await signer.getAddress();
    return (await contract.balanceOf(userAddress)).toString();
}

// get ERC20 balance for the given token, divided by its decimals
export const usdBalanceOfERC20 = async (signer: Signer, contractAddress: string, ABI: ContractInterface): Promise<number> => {
    const contract = getContract(signer, contractAddress, ABI);
    if (!contract) 
      return 0;

    const userAddress = await signer.getAddress();
    const balance = (await contract.balanceOf(userAddress)).toString();
    const decimals = (await contract.decimals()).toString();

    return Number(utils.formatUnits(balance, decimals));
}
