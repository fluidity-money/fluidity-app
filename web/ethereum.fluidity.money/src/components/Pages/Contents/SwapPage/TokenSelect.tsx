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
}: {
  type: string;
  toggle?: () => void;
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

  // const [extTokens, setExtTokens] = useState(data.slice(0, data.length / 2));
  // const [intTokens, setIntTokens] = useState(
  //   data.slice(data.length / 2, data.length)
  // );

  useEffect(() => {
    wallet.status === "connected" && getAmounts();
    wallet.status !== "connected" && resetAmounts();
  }, [toggle]);

  const resetAmounts = () => {
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) => Object.assign(item, { amount: "0.0" }))
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) => Object.assign(item, { amount: "0.0" }))
    );
  };

  // const getAmount = (
  //   token: string,
  //   decimals: number,
  //   setAmount: React.Dispatch<React.SetStateAction<TokenList["kind"]>>
  // ) => {
  //   signer &&
  //     getBalanceOfERC20(
  //       token as SupportedFluidContracts,
  //       signer,
  //       decimals
  //     ).then((r) =>
  //       setAmount((previousState) =>
  //         [...previousState]?.map((item) =>
  //           item.symbol === token ? Object.assign(item, { amount: r }) : item
  //         )
  //       )
  //     );
  // };

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

  const setAmounts = (token: TokenKind, type: string, r: string) => {
    switch (type) {
      case "non fluid":
        setTokens((previousState) =>
          [...previousState]?.map((item) =>
            item.symbol === token.symbol
              ? Object.assign(item, { amount: r })
              : item
          )
        );
        break;
      case "fluid":
        setFluidTokens((previousState) =>
          [...previousState]?.map((item) =>
            item.symbol === token.symbol
              ? Object.assign(item, { amount: r })
              : item
          )
        );
        break;
    }
  };

  const changePinned = (token: string) => {
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === `f${token}`
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
  };

  const changePinnedFluid = (token: string) => {
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.substring(1)
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token
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
            type={type}
            changePinned={changePinned}
            resetLists={resetLists}
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
