// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import {Contract, Event, Signer} from "ethers";
import {SupportedTokens} from "components/types";
import contractList, {SupportedFluidContracts, SupportedNetworks} from 'util/contractList';
import {BigNumber, formatUnits} from "ethers/utils";

export type ListenerArgs = [
    sender: string,
    receiver: string,
    amount: BigNumber,
    event: Event, 
]

//get an ethers contract from list of available contracts
export const getContract = (network: SupportedNetworks, contractName: SupportedFluidContracts, signer: Signer) => {
    const {[contractName]: {addr, abi} = {addr: '', abi: ''}} = contractList[network] || {};
    if (!addr || !abi) return null;
    return new Contract(addr, abi, signer);
}

export const getContractDecimals = (network: SupportedNetworks, contractName: SupportedFluidContracts): number | undefined => {
    const {decimals} = contractList[network]?.[contractName] || {};
    return decimals;
}

export type ContractInfo = {
    contract: Contract,
    name: string,
    decimals: number
}
// get an array of ethers contracts for every available f<Token> contract
// including the contract's human readable name
export const getAllFluidContracts = (network: SupportedNetworks, signer: Signer): Array<ContractInfo> => {
    const contracts: Array<ContractInfo> = []
    for (const contractName of Object.keys(contractList[network] || {})) {
        if (contractName.startsWith('f')) {
            const contract = getContract(network, contractName as SupportedFluidContracts, signer);
            const decimals = getContractDecimals(network, contractName as SupportedFluidContracts);

            if (contract && decimals)
                contracts.push({contract, name: contractName, decimals});
        }
    }

    return contracts;
}

//get ERC20 balance for the given token
export const getBalanceOfERC20 = async(token: SupportedFluidContracts, signer: Signer, decimals: number) => {
    const contract = getContract('ETH', token, signer);
    if (!contract) return "0";
    const address = await signer.getAddress();
    return formatUnits((await contract.balanceOf(address)).toString(), decimals).toString();
}
