import { SupportedFluidContracts, SupportedContracts } from "util/contractList";
import { extOptions, intOptions } from "components/Token/TokenTypes";
import { TokenKind } from "components/types";
import BN from "bn.js";
import {getBalanceOfSPL} from "./contractUtils";
import {UseSolana} from "@saberhq/use-solana";
import {Token} from '@saberhq/token-utils';
import {TokenAmount} from "@ubeswap/token-math";
import {FluidTokens} from "./hooks/useFluidTokens";

export interface walletDataType {
    type: string
    amount: string
    colour: string
}

const getWalletSPLStatus = async (
    sol: UseSolana,
    tokens: FluidTokens | null
) => {
    if (!sol.connected || !sol.publicKey || !tokens) {return []};
    const {connection, publicKey} = sol;

    const renderedStatus: walletDataType[] = [];

    // Render external token types
    await Promise.all(extOptions.map(async (value: TokenKind) => {
        const token = tokens[value.type];
        if (!token)
            return Promise.resolve();
        // Gets amount
        // TODO: Test me - This looks serial
        const amount = await getBalanceOfSPL(token, connection, publicKey);
        if(new BN(amount.amount).gt(new BN(0))) {
            const renderedType: walletDataType = ({
                type: value.type,
                amount: amount.uiAmountString || "0",
                colour: value.colour
            })
            renderedStatus.push(renderedType)
        }
        return Promise.resolve();
    }));

    // Render internal token types
    await Promise.all(intOptions.map(async (value: TokenKind) => {
        const token = tokens[value.type];
        //if token isn't implemented, ignore it - don't fail
        if (!token)
            return Promise.resolve();
        // Gets amount
        const amount = await getBalanceOfSPL(token, connection, publicKey);
        if(new BN(amount.amount).gt(new BN(0))) {
            const renderedType: walletDataType = ({
                type: value.type,
                amount: amount.uiAmountString || "0",
                colour: value.colour
            })
            renderedStatus.push(renderedType)
        }
        return Promise.resolve();
    }));

    return renderedStatus;
}

export default getWalletSPLStatus;
