import { SupportedTokens } from "components/types";
import BN from "bn.js";
import {getBalanceOfSPL} from "./contractUtils";
import {UseSolana} from "@saberhq/use-solana";
import {FluidTokenList, FluidTokens} from "./hooks/useFluidTokens";

export interface walletDataType {
    type: string
    amount: string
    colour: string
}

const getWalletSPLStatus = async (
    sol: UseSolana<any>,
    tokens: FluidTokens | null,
    fluidTokensList: FluidTokenList,
    nonFluidTokensList: FluidTokenList,
) => {
    if (!sol.connected || !sol.publicKey || !tokens) {return []};
    const {connection, publicKey} = sol;

    const renderedStatus: walletDataType[] = [];

    // Render external token types
    await Promise.all(nonFluidTokensList.map(async(value) => {
        const {token} = tokens[value.token.symbol as SupportedTokens] || {};
        if (!token)
            return Promise.resolve();
        // Gets amount
        // TODO: Test me - This looks serial
        const amount = await getBalanceOfSPL(token, connection, publicKey);
        if(new BN(amount.amount).gt(new BN(0))) {
            const renderedType: walletDataType = ({
                type: value.token.symbol,
                amount: amount.uiAmountString || "0",
                colour: value.config.colour
            })
            renderedStatus.push(renderedType)
        }
        return Promise.resolve();
    }));

    // Render internal token types
    await Promise.all(fluidTokensList.map(async(value) => {
        const {token} = tokens[value.token.symbol as SupportedTokens] || {};
        //if token isn't implemented, ignore it - don't fail
        if (!token)
            return Promise.resolve();
        // Gets amount
        const amount = await getBalanceOfSPL(token, connection, publicKey);
        if(new BN(amount.amount).gt(new BN(0))) {
            const renderedType: walletDataType = ({
                type: value.token.symbol,
                amount: amount.uiAmountString || "0",
                colour: value.config.colour
            })
            renderedStatus.push(renderedType)
        }
        return Promise.resolve();
    }));

    return renderedStatus;
}

export default getWalletSPLStatus;
