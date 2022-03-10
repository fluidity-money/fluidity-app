import { getBalanceOfERC20 } from "util/contractUtils";
import { SupportedFluidContracts, SupportedContracts } from "util/contractList";
import { extOptions, intOptions } from "components/Token/TokenTypes";
import { TokenKind } from "components/types";
import { Signer } from "ethers";
import { parseUnits } from "ethers/utils";

export interface walletDataType {
    type: string
    amount: string
    colour: string
}

const getWalletERC20Status = async(signer: Signer) => {

    // If signer is defined (someone is logged in), nothing happens.
    // Else if signer is undefined/null, it returns a blank array since no wallet means no information
    if(!signer) { return [] };

    const renderedStatus: walletDataType[] = [];

        // Render external token types
    await Promise.all(extOptions.map(async(value: TokenKind) => {
        // Gets amount
        const amount = await(getBalanceOfERC20(value.type as SupportedContracts, signer))
        if(parseUnits(amount).gt(0)) {
            const renderedType: walletDataType = ({
                type: value.type,
                amount: amount,
                colour: value.colour
            })
            renderedStatus.push(renderedType)
        }
        return Promise.resolve();
    }));

    // Render internal token types
    await Promise.all(intOptions.map(async(value: TokenKind) => {
        // Gets amount
        const amount = await(signer! && getBalanceOfERC20(value.type as SupportedFluidContracts, signer))
        if(parseUnits(amount).gt(0)) {
            const renderedType: walletDataType = ({
                type: value.type,
                amount: amount,
                colour: value.colour
            })
            renderedStatus.push(renderedType)
        }
        return Promise.resolve();
    }));

    return renderedStatus;
}

export default getWalletERC20Status;