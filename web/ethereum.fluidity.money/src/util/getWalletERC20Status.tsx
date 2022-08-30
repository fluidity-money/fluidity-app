// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { getBalanceOfERC20 } from "util/contractUtils";
import contractList, {
  SupportedFluidContracts,
  SupportedContracts,
} from "util/contractList";
import { TokenKind } from "components/types";
import { Signer } from "ethers";
import { parseUnits } from "ethers/utils";
import { tokenData } from "./tokenData";

export interface walletDataType {
  type: string;
  amount: string;
  colour: string;
}

// Assigns the correct json file based on ChainId
const getWalletERC20Status = async (signer: Signer) => {
  // If signer is defined (someone is logged in), nothing happens.
  // Else if signer is undefined/null, it returns a blank array since no wallet means no information
  if (!signer) {
    return [];
  }

  const renderedStatus: walletDataType[] = [];
  const ext = tokenData.slice(0, tokenData.length / 2);
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
  const int = tokenData.slice(tokenData.length / 2, tokenData.length);
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
