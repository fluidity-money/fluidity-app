import TokenSelection from "components/Modal/Themes/TokenSelection";
import { useContext, useEffect, useState } from "react";
import { modalToggle } from "components/context";
import Icon from "components/Icon";
import { TokenKind } from "components/types";
import ropsten from "../../../../config/ropsten-tokens.json";
import testing from "../../../../config/testing-tokens.json";
import kovan from "../../../../config/kovan-tokens.json";
import { useSigner } from "util/hooks";
import { getBalanceOfERC20 } from "util/contractUtils";
import { TokenList } from "components/types";
import { useWallet } from "use-wallet";
import { SupportedFluidContracts } from "util/contractList";

const TokenSelect = ({
  type,
  toggle,
  pinnedTokens,
  pinnedFluidTokens,
  sortPinned,
  sortPinnedFluid,
}: {
  type: string;
  toggle?: () => void;
  pinnedTokens?: TokenList["kind"];
  pinnedFluidTokens?: TokenList["kind"];
  sortPinned?: (token: TokenKind) => void;
  sortPinnedFluid?: (token: TokenKind) => void;
}) => {
  const [selectedToken] = useContext(modalToggle).selectedToken;
  const [selectedFluidToken] = useContext(modalToggle).selectedFluidToken;
  const signer = useSigner();
  const wallet = useWallet();

  // Assigns the correct json file based on ChainId
  const data =
    process.env.REACT_APP_CHAIN_ID === "3"
      ? (ropsten as TokenKind[])
      : process.env.REACT_APP_CHAIN_ID === "31337"
      ? (testing as TokenKind[])
      : process.env.REACT_APP_CHAIN_ID === "2a"
      ? (kovan as TokenKind[])
      : (ropsten as TokenKind[]);

  const [tokens, setTokens] = useState(data.slice(0, data.length / 2));

  const [fluidTokens, setFluidTokens] = useState(
    data.slice(data.length / 2, data.length)
  );

  // const [pinnedTokens, setPinnedTokens] = useState(
  //   data.slice(0, data.length / 2)
  // );

  // const [pinnedFluidTokens, setPinnedFluidTokens] = useState(
  //   data.slice(data.length / 2, data.length)
  // );

  // const sortPinned = (token: TokenKind) => {
  //   setPinnedTokens(
  //     pinnedTokens.sort((y, x) => {
  //       return x.symbol === token.symbol
  //         ? -1
  //         : y.symbol === token.symbol
  //         ? 1
  //         : 0;
  //     })
  //   );
  //   setPinnedFluidTokens(
  //     pinnedFluidTokens.sort((y, x) => {
  //       console.log(x.symbol, `f${token.symbol}`);
  //       return x.symbol === `f${token.symbol}`
  //         ? -1
  //         : y.symbol === `f${token.symbol}`
  //         ? 1
  //         : 0;
  //     })
  //   );
  //   console.log("PT", pinnedTokens);
  //   console.log("PFT", pinnedFluidTokens);
  // };

  // const sortPinnedFluid = (token: TokenKind) => {
  //   setPinnedFluidTokens(
  //     pinnedFluidTokens.sort((y, x) => {
  //       return x.symbol === token.symbol
  //         ? -1
  //         : y.symbol === token.symbol
  //         ? 1
  //         : 0;
  //     })
  //   );
  //   setPinnedTokens(
  //     pinnedTokens.sort((y, x) => {
  //       return x.symbol === token.symbol.substring(1)
  //         ? -1
  //         : y.symbol === token.symbol.substring(1)
  //         ? 1
  //         : 0;
  //     })
  //   );
  //   console.log("PT", pinnedTokens);
  //   console.log("PFT", pinnedFluidTokens);
  // };

  useEffect(() => {
    wallet.status === "connected" && getAmounts();
    wallet.status !== "connected" && resetAmounts();
    resetLists();
  }, [toggle]);

  // resets token amount to zero
  const resetAmounts = () => {
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) => Object.assign(item, { amount: "0.0" }))
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) => Object.assign(item, { amount: "0.0" }))
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

  const changePinned = (token: TokenKind) => {
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === `f${token.symbol}`
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    // setPinnedTokens((pinnedTokens) => [...pinnedTokens, token]);
    // setPinnedFluidTokens((pinnedFluidTokens) => [...pinnedFluidTokens, token]);
  };

  const changePinnedFluid = (token: TokenKind) => {
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol.substring(1)
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
  };

  const resetLists = () => {
    setTokens(data.slice(0, data.length / 2));
    setFluidTokens(data.slice(data.length / 2, data.length));
  };

  switch (type) {
    case "token":
      return (
        <div className="token-selection-container flex align" onClick={toggle}>
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
            pinnedList={pinnedTokens ? pinnedTokens : []}
            setTokenList={setTokens}
            type={type}
            changePinned={changePinned}
            resetLists={resetLists}
            sortPinned={sortPinned ? sortPinned : () => {}}
          />
        </div>
      );
    case "fluid":
      return (
        <div className="token-selection-container flex align" onClick={toggle}>
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
            pinnedList={pinnedFluidTokens ? pinnedFluidTokens : []}
            setTokenList={setFluidTokens}
            type={type}
            changePinned={changePinnedFluid}
            resetLists={resetLists}
            sortPinned={sortPinnedFluid ? sortPinnedFluid : () => {}}
          />
        </div>
      );
    default:
      return <div></div>;
  }
};

export default TokenSelect;
