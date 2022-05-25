import {getATAAddressSync, RAW_SOL, Token, TokenAmount} from "@saberhq/token-utils";
import {Connection, PublicKey, TokenAmount as TokenAmountType} from '@solana/web3.js';

//get SPL balance for the given token
export const getBalanceOfSPL = async(token: Token, connection: Connection, ownerPub: PublicKey): Promise<TokenAmountType> => {
    try {
        //balance of SOL represented as a TokenAmount
        if (token.name === "Solana") {
            const value = await connection.getBalance(ownerPub);
            const amount = new TokenAmount(RAW_SOL.devnet, value);
            return {
                amount: String(value),
                decimals: amount.token.decimals,
                uiAmount: value,
                uiAmountString: amount.toExact()
            }
        //otherwise balance of an SPL token
        } else {
            const ata = getATAAddressSync({mint: token.mintAccount, owner: ownerPub});
            const {value} = await connection.getTokenAccountBalance(ata);
            return value;
        }
    } catch (e) {
        return {
            amount: "0",
            decimals: token.decimals,
            uiAmount: 0,
            uiAmountString: "0"
        }
    }
}
