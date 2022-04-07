import { useContext, useEffect, useState } from "react";
import GenericModal from "components/Modal";
import { modalToggle } from "components/context";
import Button from "components/Button";
import { TokenKind, TokenList } from "components/types";
import { Value } from "sass";
import TokenSearch from "./TokenSearch";
import PinnedToken from "./PinnedToken";

const TokenSelection = ({
  tokenList,
  setTokenList,
  pinnedTokenList,
  type,
  changePinned,
  changeOtherPinned,
  resetLists,
  update,
}: {
  tokenList: TokenList["kind"];
  setTokenList: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
  pinnedTokenList: TokenList["kind"];
  type: string;
  changePinned: (token: string) => void;
  changeOtherPinned: (token: TokenKind) => void;
  resetLists: () => void;
  update: () => void;
}) => {
  const [toggleFrom, togglerFrom] = useContext(modalToggle).toggleFrom;
  const [toggleTo, togglerTo] = useContext(modalToggle).toggleTo;
  const setterToken = useContext(modalToggle).selectedToken[1];
  const setterFluidToken = useContext(modalToggle).selectedFluidToken[1];
  const [tokenListState, setTokenListState] = useState<TokenList["kind"]>([]);

  useEffect(() => {
    // setForButtons(type);
    // resetLists();
    console.log(pinnedTokenList);
  }, [type]);

  // const setForButtons = (type: string) => {
  //   switch (type) {
  //     case "token":
  //       setTokenList(tokenList);
  //       return;
  //     case "fluid":
  //       setTokenList(tokenList);
  //       return;
  //     default:
  //       console.log("err");
  //   }
  // };

  const setToken = (type: string, value: TokenKind["symbol"]) => {
    switch (type) {
      case "token":
        setterToken(value);
        togglerTo();
        return;
      case "fluid":
        setterFluidToken(value);
        togglerFrom();
        return;
      default:
        console.log("err");
    }
  };

  const renderedTokenSet = tokenList.map((token, index) => {
    return (
      <div className="token-list-item">
        <Button
          key={index}
          label={token.symbol}
          token={token}
          theme="select-token-button"
          texttheme="select-token-text"
          fontSize="font-large"
          icon={
            <img
              src={`${token.image}`}
              className="token-list-icon"
              alt={token.symbol}
            />
          }
          goto={() => {
            setToken(type, token.symbol);
            resetLists();
            // setForButtons(type);
          }}
        />
        <img
          className="pin-icon"
          onClick={() => {
            changePinned(token.symbol);
            changeOtherPinned(token);
          }}
          src={token?.pinned ? "img/pinnedIcon.svg" : "img/pinIcon.svg"}
          alt="pin"
        />
      </div>
    );
  });

  return (
    <GenericModal
      enable={type === "token" ? toggleTo : toggleFrom}
      toggle={type === "token" ? togglerTo : togglerFrom}
      height="auto"
      // width="20rem"
    >
      <div className="connect-modal-body">
        <h2 className="primary-text">Select a Token</h2>
        <TokenSearch
          setTokenListState={setTokenList}
          tokenList={tokenList}
          resetLists={resetLists}
        />
        <div className="pinned-tokens">
          {pinnedTokenList
            // .sort(function (x: { pinned: boolean }, y: { pinned: boolean }) {
            //   return x.pinned === y.pinned ? 0 : x.pinned ? -1 : 1;
            // })
            .map(
              (token: TokenKind, index: number) =>
                token.pinned && (
                  <PinnedToken
                    key={index}
                    token={token}
                    changePinned={changePinned}
                    changeOtherPinned={changeOtherPinned}
                    setTokenHandler={() => {
                      setToken(type, token.symbol);
                      resetLists();
                      // setForButtons(type);
                    }}
                  />
                )
            )}
        </div>
        <hr
          style={{
            backgroundColor: "white",
            width: "90%",
          }}
        />
        <div className="connect-modal-form token-list">
          {tokenList.length ? (
            renderedTokenSet
          ) : (
            <>
              <img
                src="https://app.1inch.io/assets/images/simple/empty-list-light-theme-x2.png"
                alt="nothing found"
                className="not-found-icon"
              />
              <div className="not-found-text">Nothing Found</div>
            </>
          )}
        </div>
      </div>
    </GenericModal>
  );
};

export default TokenSelection;
