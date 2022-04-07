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

  const [tokens, setTokens] = useState(
    JSON.parse(JSON.stringify(data.slice(0, data.length / 2)))
  );
  const [fluidTokens, setFluidTokens] = useState(
    JSON.parse(JSON.stringify(data.slice(data.length / 2, data.length)))
  );
  const [pinnedTokens, setPinnedTokens] = useState<TokenList["kind"]>([]);
  const [pinnedFluidTokens, setPinnedFluidTokens] = useState<TokenList["kind"]>(
    []
  );

  // const [extTokens, setExtTokens] = useState(data.slice(0, data.length / 2));
  // const [intTokens, setIntTokens] = useState(
  //   data.slice(data.length / 2, data.length)
  // );

  useEffect(() => {
    wallet.status === "connected" && getAmounts();
    wallet.status !== "connected" && resetAmounts();
    resetLists();
    console.log(pinnedFluidTokens);
    console.log(pinnedTokens);
  }, [toggle]);

  const update = () => {
    tokens.forEach((token: TokenKind) => {
      if (!pinnedTokens.includes(token) && token.pinned)
        setPinnedTokens((pinnedTokens) => [...pinnedTokens, token]);
    });
    fluidTokens.forEach((token: TokenKind) => {
      if (!pinnedFluidTokens.includes(token) && token.pinned)
        setPinnedFluidTokens((pinnedFluidTokens) => [
          ...pinnedFluidTokens,
          token,
        ]);
    });
  };

  useEffect(() => {
    tokens.forEach((token: TokenKind) => {
      if (!pinnedTokens.includes(token) && token.pinned)
        setPinnedTokens((pinnedTokens) => [...pinnedTokens, token]);
    });
    fluidTokens.forEach((token: TokenKind) => {
      if (!pinnedFluidTokens.includes(token) && token.pinned)
        setPinnedFluidTokens((pinnedFluidTokens) => [
          ...pinnedFluidTokens,
          token,
        ]);
    });
  }, []);

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
    //   setPinnedTokens(
    //     (previousState: TokenList["kind"]) =>
    //       [...previousState]?.map((item) =>
    //         item.symbol === token
    //           ? Object.assign(item, { pinned: !item.pinned })
    //           : item
    //       )
    //     // .sort(function (x: { pinned: boolean }, y: { pinned: boolean }) {
    //     //   return x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1;
    //     // })
    //   );
    //   setPinnedFluidTokens(
    //     (previousState: TokenList["kind"]) =>
    //       [...previousState]?.map((item) =>
    //         item.symbol === `f${token}`
    //           ? Object.assign(item, { pinned: !item.pinned })
    //           : item
    //       )
    //     // .sort(function (x: { pinned: boolean }, y: { pinned: boolean }) {
    //     //   return x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1;
    //     // })
    //   );
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

    // setPinnedTokens((previousState: TokenList["kind"]) =>
    //   [...previousState]
    //     ?.map((item) =>
    //       item.symbol === token.substring(1)
    //         ? Object.assign(item, { pinned: !item.pinned })
    //         : item
    //     )
    //     .sort(function (x: { pinned: boolean }, y: { pinned: boolean }) {
    //       return x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1;
    //     })
    // );
    // setPinnedFluidTokens((previousState: TokenList["kind"]) =>
    //   [...previousState]
    //     ?.map((item) =>
    //       item.symbol === token
    //         ? Object.assign(item, { pinned: !item.pinned })
    //         : item
    //     )
    //     .sort(function (x: { pinned: boolean }, y: { pinned: boolean }) {
    //       return x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1;
    //     })
    // );
  };

  const changeOtherPinned = (token: TokenKind) => {
    // normal symbol
    if (!token.pinned) {
      setPinnedTokens((pinnedTokens) => [...pinnedTokens, token]);
      // set FLUID
    }
    if (token.pinned) {
      setPinnedTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.filter((item) => {
          console.log("1", previousState, pinnedTokens);
          return item.symbol !== token.symbol;
        })
      );
      // set FLUID
      setPinnedFluidTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.filter((item) => {
          console.log("1", previousState, pinnedTokens);
          return item.symbol !== `${token.symbol}`;
        })
      );
    }
    // setPinnedTokens((previousState: TokenList["kind"]) => {
    //   [...previousState]?.map((item) =>
    //     item.symbol === token
    //       ? Object.assign(item, { pinned: !item.pinned })
    //       : item
    //   );
    //   console.log("1", previousState);
    //   return previousState;
    // });
    // setPinnedFluidTokens((previousState: TokenList["kind"]) => {
    //   [...previousState]?.map((item) =>
    //     item.symbol === `f${token}`
    //       ? Object.assign(item, { pinned: !item.pinned })
    //       : item
    //   );
    //   console.log("2", previousState);
    //   return previousState;
    // });
  };

  const changeOtherPinnedFluid = (token: TokenKind) => {
    if (!token.pinned) {
      setPinnedFluidTokens((pinnedFluidTokens) => [
        ...pinnedFluidTokens,
        token,
      ]);
    }
    if (token.pinned) {
      setPinnedFluidTokens((previousState: TokenList["kind"]) =>
        [...previousState]?.filter((item) => {
          console.log("2", previousState, pinnedTokens);
          return item.symbol !== token.symbol;
        })
      );
    }
    // console.log("other fluid fired");
    // setPinnedTokens(
    //   (previousState: TokenList["kind"]) => {
    //     [...previousState]?.map((item) =>
    //       item.symbol === token.substring(1)
    //         ? Object.assign(item, { pinned: !item.pinned })
    //         : item
    //     );
    //     console.log("3", previousState);
    //     return previousState;
    //   }
    //   // .sort((x, y) => {
    //   //   return y.symbol === token ? -1 : x.symbol === token ? 1 : 0;
    //   // })
    // );
    // setPinnedFluidTokens(
    //   (previousState: TokenList["kind"]) => {
    //     [...previousState]?.map((item) =>
    //       item.symbol === token
    //         ? Object.assign(item, { pinned: !item.pinned })
    //         : item
    //     );
    //     console.log("4", previousState);
    //     return previousState;
    //   }
    //   //   // .sort((x, y) => {
    //   //   //   return y.symbol === token ? -1 : x.symbol === token ? 1 : 0;
    //   //   // })
    // );
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
            setTokenList={setTokens}
            pinnedTokenList={pinnedTokens}
            type={type}
            changePinned={changePinned}
            changeOtherPinned={changeOtherPinned}
            resetLists={resetLists}
            update={update}
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
            setTokenList={setFluidTokens}
            pinnedTokenList={pinnedFluidTokens}
            type={type}
            changePinned={changePinnedFluid}
            changeOtherPinned={changeOtherPinnedFluid}
            resetLists={resetLists}
            update={update}
          />
        </div>
      );
    default:
      return <div></div>;
  }
};

export default TokenSelect;
