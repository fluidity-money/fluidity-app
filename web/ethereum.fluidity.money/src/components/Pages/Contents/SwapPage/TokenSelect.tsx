// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import TokenSelection from "components/Modal/Themes/TokenSelection";
import { useContext } from "react";
import { modalToggle, tokenListContext } from "components/context";
import Icon from "components/Icon";
import { TokenKind } from "components/types";
import { useSigner } from "util/hooks";
import { getBalanceOfERC20 } from "util/contractUtils";
import { TokenList } from "components/types";
import { useWallet } from "use-wallet";
import { SupportedFluidContracts } from "util/contractList";
import { appTheme } from "util/appTheme";
import {
  changePinnedFluidUtil,
  changePinnedUtil,
  sortPinnedFluidUtil,
  sortPinnedUtil,
} from "util/tokenSelectUtil";
import { tokenData } from "util/tokenData";

const TokenSelect = ({
  type,
  toggle,
}: {
  type: string;
  toggle: () => void;
}) => {
  const [selectedToken] = useContext(modalToggle).selectedToken;
  const [selectedFluidToken] = useContext(modalToggle).selectedFluidToken;
  const signer = useSigner();
  const wallet = useWallet();

  // accesses tokens from context
  const tokens: TokenKind[] = useContext(tokenListContext).tokens;
  const setTokens = useContext(tokenListContext).setTokens;
  const fluidTokens: TokenKind[] = useContext(tokenListContext).fluidTokens;
  const setFluidTokens = useContext(tokenListContext).setFluidTokens;
  // accesses pinned tokens from context
  const pinnedTokens: TokenKind[] = useContext(tokenListContext).pinnedTokens;
  const setPinnedTokens = useContext(tokenListContext).setPinnedTokens;
  const pinnedFluidTokens: TokenKind[] =
    useContext(tokenListContext).pinnedFluidTokens;
  const setPinnedFluidTokens =
    useContext(tokenListContext).setPinnedFluidTokens;

  // sorts pinned tokens in order when added
  const sortPinned = (token: TokenKind) => {
    sortPinnedUtil(
      token,
      setPinnedTokens,
      setPinnedFluidTokens,
      pinnedTokens,
      pinnedFluidTokens
    );
  };

  // sorts pinned fluid when added
  const sortPinnedFluid = (token: TokenKind) => {
    sortPinnedFluidUtil(
      token,
      setPinnedTokens,
      setPinnedFluidTokens,
      pinnedTokens,
      pinnedFluidTokens
    );
  };

  // gets each token amount
  const getAmounts = () => {
    signer &&
      tokenData.forEach((token) =>
        getBalanceOfERC20(
          token.symbol as SupportedFluidContracts,
          signer,
          token.decimals
        ).then((r) =>
          token.name.indexOf("FLUID") === -1
            ? setAmounts(token, "non fluid", r)
            : setAmounts(token, "fluid", r)
        )
      );
  };

  // sets the amounts to be added to token amount
  const setAmounts = (token: TokenKind, type: string, r: string) => {
    switch (type) {
      case "non fluid":
        setTokens((previousState: TokenList["kind"]) =>
          [...previousState]?.map((item) =>
            item.symbol === token.symbol
              ? Object.assign(item, { amount: r })
              : item
          )
        );
        break;
      case "fluid":
        setFluidTokens((previousState: TokenList["kind"]) =>
          [...previousState]?.map((item) =>
            item.symbol === token.symbol
              ? Object.assign(item, { amount: r })
              : item
          )
        );
        break;
    }
  };

  // changes token and fluid pair token from pinned to unpinned if less than 8 pinned
  const changePinned = (token: TokenKind) => {
    changePinnedUtil(
      token,
      fluidTokens,
      setPinnedTokens,
      setPinnedFluidTokens,
      setTokens,
      setFluidTokens
    );
  };

  // changes fluid token and regulat token from pinned to unpinned if less than 8 pinned
  const changePinnedFluid = (token: TokenKind) => {
    changePinnedFluidUtil(
      token,
      tokens,
      setPinnedTokens,
      setPinnedFluidTokens,
      setTokens,
      setFluidTokens
    );
  };

  // resets token lists matching pinned list
  const resetLists = () => {
    setTokens(JSON.parse(JSON.stringify(pinnedTokens)));
    setFluidTokens(JSON.parse(JSON.stringify(pinnedFluidTokens)));
    getAmounts();
  };

  switch (type) {
    case "token":
      return (
        <div
          className={`token-selection-container${appTheme} flex align`}
          onClick={() => {
            toggle();
            resetLists();
            wallet.status === "connected" && getAmounts();
          }}
        >
          {selectedToken}
          <Icon
            src={`${
              selectedToken === "Select Token"
                ? "i-menu-dropdown-arrow"
                : `icon i-${selectedToken}`
            }`}
          />
          <TokenSelection
            tokenList={tokens}
            pinnedList={pinnedTokens}
            setTokenList={setTokens}
            type={type}
            changePinned={changePinned}
            resetLists={resetLists}
            sortPinned={sortPinned}
          />
        </div>
      );
    case "fluid":
      return (
        <div
          className={`token-selection-container${appTheme} flex align`}
          onClick={() => {
            toggle();
            resetLists();
            wallet.status === "connected" && getAmounts();
          }}
        >
          {selectedFluidToken}
          <Icon
            src={`${
              selectedFluidToken === "Select FLUID"
                ? "i-menu-dropdown-arrow"
                : `icon i-${selectedFluidToken}`
            }`}
          />
          <TokenSelection
            tokenList={fluidTokens}
            pinnedList={pinnedFluidTokens}
            setTokenList={setFluidTokens}
            type={type}
            changePinned={changePinnedFluid}
            resetLists={resetLists}
            sortPinned={sortPinnedFluid}
          />
        </div>
      );
    default:
      return <div></div>;
  }
};

export default TokenSelect;
