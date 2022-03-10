import {Contract, Event, Signer} from "ethers";
import {SupportedTokens} from "components/types";
import contractList, {SupportedFluidContracts} from 'util/contractList';
import {BigNumber, formatUnits} from "ethers/utils";

export type ListenerArgs = [
    sender: string,
    receiver: string,
    amount: BigNumber,
    event: Event, 
]

//get an ethers contract from list of available contracts
export const getContract = (network: SupportedTokens, contractName: SupportedFluidContracts, signer: Signer) => {
    const {[contractName]: {addr, abi} = {addr: '', abi: ''}} = contractList[network] || {};
    if (!addr || !abi) return null;
    return new Contract(addr, abi, signer);
}

// get an array of ethers contracts for every available f<Token> contract
// including the contract's human readable name
export const getAllFluidContracts = (network: SupportedTokens, signer: Signer): Array<{contract: Contract, name: string}> => {
    const contracts: Array<{contract: Contract, name: string}> = []
    for (const contractName of Object.keys(contractList[network] || {})) {
        if (contractName.startsWith('f')) {
            const contract = getContract(network, contractName as SupportedFluidContracts, signer);
            if (contract)
                contracts.push({contract, name: contractName});
        }
    }

    return contracts;
}

//get ERC20 balance for the given token
export const getBalanceOfERC20 = async(token: SupportedFluidContracts, signer: Signer) => {
    const contract = getContract('ETH', token, signer);
    if (!contract) return "0";
    const address = await signer.getAddress();
    return formatUnits((await contract.balanceOf(address)).toString(), 6).toString();
}
