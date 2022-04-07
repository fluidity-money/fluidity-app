import { getBalanceOfERC20 } from "util/contractUtils";
import contractList, {
  SupportedFluidContracts,
  SupportedContracts,
} from "util/contractList";
import ropsten from "../config/ropsten-tokens.json";
import testing from "../config/testing-tokens.json";
import kovan from "../config/kovan-tokens.json";
import { TokenKind } from "components/types";
import { Signer } from "ethers";
import { parseUnits } from "ethers/utils";

export interface walletDataType {
  type: string;
  amount: string;
  colour: string;
}

// Assigns the correct json file based on ChainId
const getWalletERC20Status = async (signer: Signer) => {
  const data =
    process.env.REACT_APP_CHAIN_ID === "3"
      ? (ropsten as TokenKind[])
      : process.env.REACT_APP_CHAIN_ID === "31337"
      ? (testing as TokenKind[])
      : process.env.REACT_APP_CHAIN_ID === "2a"
      ? (kovan as TokenKind[])
      : (ropsten as TokenKind[]);

  // If signer is defined (someone is logged in), nothing happens.
  // Else if signer is undefined/null, it returns a blank array since no wallet means no information
  if (!signer) {
    return [];
  }

  const renderedStatus: walletDataType[] = [];
  const ext = data.slice(0, data.length / 2);
  // Render external token types
  await Promise.all(
    ext.map(async (value: TokenKind) => {
      const { decimals } =
        contractList.ETH?.[value.symbol as SupportedContracts] || {};
      if (!decimals) return;
      // Gets amount
      const amount = await getBalanceOfERC20(
        value.symbol as SupportedContracts,
        signer,
        decimals
      );
      if (parseUnits(amount).gt(0)) {
        const renderedType: walletDataType = {
          type: value.symbol,
          amount: amount,
          colour: value.colour,
        };
        renderedStatus.push(renderedType);
      }
      return Promise.resolve();
    })
  );

  // Render internal token types
  const int = data.slice(data.length / 2, data.length);
  await Promise.all(
    int.map(async (value: TokenKind) => {
      const { decimals } =
        contractList.ETH?.[value.symbol as SupportedContracts] || {};
      if (!decimals) return;
      // Gets amount
      const amount = await (signer! &&
        getBalanceOfERC20(
          value.symbol as SupportedFluidContracts,
          signer,
          decimals
        ));
      if (parseUnits(amount).gt(0)) {
        const renderedType: walletDataType = {
          type: value.symbol,
          amount: amount,
          colour: value.colour,
        };
        renderedStatus.push(renderedType);
      }
      return Promise.resolve();
    })
  );

  return renderedStatus;
};

export default getWalletERC20Status;
