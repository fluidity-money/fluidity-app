// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import TokenSelection from "components/Modal/Themes/TokenSelection";
import { useContext, useEffect } from "react";
import { ModalToggle, TokenListContext } from "components/context";
import Icon from "components/Icon";
import { useFluidToken } from "util/hooks";
import { FluidTokenList, TokenInfo } from "util/hooks/useFluidTokens";
import { isTemplateTail } from "typescript";
import {
  changePinnedFluidUtil,
  changePinnedUtil,
  setAmountUtil,
} from "util/pinnedUtils";
import { useSolana } from "@saberhq/use-solana";
import { getBalanceOfSPL } from "util/contractUtils";

const TokenSelect = ({
  type,
  toggle,
}: {
  type: string;
  toggle?: () => void;
}) => {
  const [selectedToken] = useContext(ModalToggle).selectedToken;
  const [selectedFluidToken] = useContext(ModalToggle).selectedFluidToken;
  const sol = useSolana();
  const { fluidTokensList, nonFluidTokensList, tokens } = useFluidToken();

  // accesses tokens from context
  const selectTokens = useContext(TokenListContext).selectTokens;
  const setSelectTokens = useContext(TokenListContext).setSelectTokens;
  const selectFluidTokens = useContext(TokenListContext).selectFluidTokens;
  const setSelectFluidTokens =
    useContext(TokenListContext).setSelectFluidTokens;
  // accesses pinned tokens from context
  const selectPinnedTokens = useContext(TokenListContext).selectPinnedTokens;
  const setSelectPinnedTokens =
    useContext(TokenListContext).setSelectPinnedTokens;
  const selectPinnedFluidTokens =
    useContext(TokenListContext).selectPinnedFluidTokens;
  const setSelectPinnedFluidTokens =
    useContext(TokenListContext).setSelectPinnedFluidTokens;

  // gets each token amount for fluid and non fluid
  const getAmounts = () => {
    tokens && getAmountUtil(nonFluidTokensList, "non fluid");
    getAmountUtil(fluidTokensList, "fluid");
  };

  // repeated function for fluid and non fluid token lists
  const getAmountUtil = (tokenList: FluidTokenList, type: string) => {
    tokenList.forEach(
      (token) =>
        sol.publicKey &&
        getBalanceOfSPL(token.token, sol.connection, sol.publicKey).then(
          (r) => r.uiAmountString && setAmounts(token, type, r.uiAmountString)
        )
    );
  };

  // sets the amounts to be added to token amount
  const setAmounts = (token: TokenInfo, type: string, r: string) => {
    switch (type) {
      case "non fluid":
        setAmountUtil(token, r, setSelectTokens);
        break;
      case "fluid":
        setAmountUtil(token, r, setSelectFluidTokens);
        break;
    }
  };

  // changes token and fluid pair token from pinned to unpinned if less than 8 pinned
  // sorts pinned tokens in order when added
  const changePinned = (token: TokenInfo) => {
    changePinnedUtil(
      token,
      selectTokens,
      setSelectPinnedTokens,
      setSelectPinnedFluidTokens,
      setSelectTokens,
      setSelectFluidTokens
    );
  };

  // changes fluid token and non-fluid token from pinned to unpinned if less than 8 pinned
  // sorts pinned tokens in order when added
  const changePinnedFluid = (token: TokenInfo) => {
    changePinnedFluidUtil(
      token,
      selectFluidTokens,
      setSelectPinnedTokens,
      setSelectPinnedFluidTokens,
      setSelectTokens,
      setSelectFluidTokens
    );
  };

  // resets token lists matching pinned list
  const resetLists = () => {
    setSelectTokens(JSON.parse(JSON.stringify(selectPinnedTokens)));
    setSelectFluidTokens(JSON.parse(JSON.stringify(selectPinnedFluidTokens)));
    getAmounts();
  };

  switch (type) {
    case "token":
      return (
        <div
          className="token-selection-container flex align"
          onClick={() => {
            toggle && toggle();
            resetLists();
            // wallet.status === "connected" && getAmounts();
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
            tokenList={selectTokens}
            pinnedList={selectPinnedTokens}
            setTokenList={setSelectTokens}
            type={type}
            changePinned={changePinned}
            resetLists={resetLists}
          />
        </div>
      );
    case "fluid":
      return (
        <div
          className="token-selection-container flex align"
          onClick={() => {
            toggle && toggle();
            resetLists();
            // wallet.status === "connected" && getAmounts();
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
            tokenList={selectFluidTokens}
            pinnedList={selectPinnedFluidTokens}
            setTokenList={setSelectFluidTokens}
            type={type}
            changePinned={changePinnedFluid}
            resetLists={resetLists}
          />
        </div>
      );
    default:
      return <div></div>;
  }
};

export default TokenSelect;
