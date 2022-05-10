import TokenSelection from "components/Modal/Themes/TokenSelection";
import { useContext, useEffect, useMemo, useState } from "react";
import { modalToggle, tokenListContext } from "components/context";
import Icon from "components/Icon";
import { TokenKind } from "components/types";
import ropsten from "../../../../config/ropsten-tokens.json";
import testing from "../../../../config/testing-tokens.json";
import kovan from "../../../../config/kovan-tokens.json";
import mainnet from "../../../../config/mainnet-tokens.json";
import ChainId, { chainIdFromEnv } from "util/chainId";
import { useSigner } from "util/hooks";
import { getBalanceOfERC20 } from "util/contractUtils";
import { TokenList } from "components/types";
import { useWallet } from "use-wallet";
import { SupportedFluidContracts } from "util/contractList";

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

  // Assigns the correct json file based on ChainId
  const chainId = chainIdFromEnv();
  const data =
    chainId === ChainId.Ropsten
      ? (ropsten as TokenKind[])
      : chainId === ChainId.Hardhat
      ? (testing as TokenKind[])
      : chainId === ChainId.Kovan
      ? (kovan as TokenKind[])
      : chainId === ChainId.Mainnet
      ? (mainnet as TokenKind[])
      : (ropsten as TokenKind[]);

  // accesses tokens from context
  const pokens: TokenKind[] = useContext(tokenListContext).tokens;
  const setPokens = useContext(tokenListContext).setTokens;
  const fluidPokens: TokenKind[] = useContext(tokenListContext).fluidTokens;
  const setFluidPokens = useContext(tokenListContext).setFluidTokens;
  // accesses pinned tokens from context
  const pinnedTokens: TokenKind[] = useContext(tokenListContext).pinnedTokens;
  const setPinnedTokens = useContext(tokenListContext).setPinnedTokens;
  const pinnedFluidTokens: TokenKind[] =
    useContext(tokenListContext).pinnedFluidTokens;
  const setPinnedFluidTokens =
    useContext(tokenListContext).setPinnedFluidTokens;

  // sorts pinned tokens in order when added
  const sortPinned = (token: TokenKind) => {
    setPinnedTokens(
      [...pinnedTokens].sort((y, x) => {
        return x.symbol === token.symbol
          ? -1
          : y.symbol === token.symbol
          ? 1
          : 0;
      })
    );
    setPinnedFluidTokens(
      [...pinnedFluidTokens].sort((y, x) => {
        return x.symbol === `f${token.symbol}`
          ? -1
          : y.symbol === `f${token.symbol}`
          ? 1
          : 0;
      })
    );
  };

  // sorts pinned fluid when added
  const sortPinnedFluid = (token: TokenKind) => {
    setPinnedFluidTokens(
      [...pinnedFluidTokens].sort((y, x) => {
        return x.symbol === token.symbol
          ? -1
          : y.symbol === token.symbol
          ? 1
          : 0;
      })
    );
    setPinnedTokens(
      [...pinnedTokens].sort((y, x) => {
        return x.symbol === token.symbol.substring(1)
          ? -1
          : y.symbol === token.symbol.substring(1)
          ? 1
          : 0;
      })
    );
  };

  // gets each token amount
  const getAmounts = () => {
    signer &&
      data.forEach((token) =>
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
        setPokens((previousState: TokenList["kind"]) =>
          [...previousState]?.map((item) =>
            item.symbol === token.symbol
              ? Object.assign(item, { amount: r })
              : item
          )
        );
        break;
      case "fluid":
        setFluidPokens((previousState: TokenList["kind"]) =>
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
    // size and filter to determine if 8 are pinned already and the current selected can be pinned/unpinned
    const size = pokens.filter(
      (selectedToken) => selectedToken.pinned === true
    ).length;
    if (size < 8 || (size === 8 && token.pinned === true)) {
      setPinnedTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === token.symbol
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
      setPinnedFluidTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === `f${token.symbol}`
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
      setPokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === token.symbol
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
      setFluidPokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === `f${token.symbol}`
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
    }
  };

  // changes fluid token and regulat token from pinned to unpinned if less than 8 pinned
  const changePinnedFluid = (token: TokenKind) => {
    // size and filter to determine if 8 are pinned already and the current selected can be pinned/unpinned
    const size = fluidPokens.filter(
      (selectedToken) => selectedToken.pinned === true
    ).length;
    if (size < 8 || (size === 8 && token.pinned === true)) {
      setPinnedTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === token.symbol.substring(1)
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
      setPinnedFluidTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === token.symbol
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
      setPokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === token.symbol.substring(1)
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
      setFluidPokens((previousState: TokenList["kind"]) =>
        [...previousState]?.map((item) =>
          item.symbol === token.symbol
            ? Object.assign(item, { pinned: !item.pinned })
            : item
        )
      );
    }
  };

  // resets token lists matching pinned list
  const resetLists = () => {
    setPokens(JSON.parse(JSON.stringify(pinnedTokens)));
    setFluidPokens(JSON.parse(JSON.stringify(pinnedFluidTokens)));
    getAmounts();
  };

  switch (type) {
    case "token":
      return (
        <div
          className="token-selection-container flex align"
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
            tokenList={pokens}
            pinnedList={pinnedTokens}
            setTokenList={setPokens}
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
          className="token-selection-container flex align"
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
            tokenList={fluidPokens}
            pinnedList={pinnedFluidTokens}
            setTokenList={setFluidPokens}
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
