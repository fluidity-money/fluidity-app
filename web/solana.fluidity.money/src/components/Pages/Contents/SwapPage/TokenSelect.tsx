import TokenSelection from "components/Modal/Themes/TokenSelection";
import { useContext, useEffect } from "react";
import { modalToggle, tokenListContext } from "components/context";
import Icon from "components/Icon";
import { useFluidToken } from "util/hooks";
import { TokenInfo } from "util/hooks/useFluidTokens";
import { isTemplateTail } from "typescript";
import { changePinnedFluidUtil, changePinnedUtil } from "util/pinnedUtils";

const TokenSelect = ({
  type,
  toggle,
}: {
  type: string;
  toggle?: () => void;
}) => {
  const [selectedToken] = useContext(modalToggle).selectedToken;
  const [selectedFluidToken] = useContext(modalToggle).selectedFluidToken;

  const { fluidTokensList, nonFluidTokensList } = useFluidToken();

  // accesses tokens from context
  const selectTokens = useContext(tokenListContext).selectTokens;
  const setSelectTokens = useContext(tokenListContext).setSelectTokens;
  const selectFluidTokens = useContext(tokenListContext).selectFluidTokens;
  const setSelectFluidTokens =
    useContext(tokenListContext).setSelectFluidTokens;
  // accesses pinned tokens from context
  const selectPinnedTokens = useContext(tokenListContext).selectPinnedTokens;
  const setSelectPinnedTokens =
    useContext(tokenListContext).setSelectPinnedTokens;
  const selectPinnedFluidTokens =
    useContext(tokenListContext).selectPinnedFluidTokens;
  const setSelectPinnedFluidTokens =
    useContext(tokenListContext).setSelectPinnedFluidTokens;

  // gets each token amount
  const getAmounts = () => {};

  const setAmounts = () => {};

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
