// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { useContext } from "react";
import GenericModal from "components/Modal";
import { modalToggle } from "components/context";
import Button from "components/Button";
import { TokenKind, TokenList } from "components/types";
import TokenSearch from "./TokenSearch";
import PinnedToken from "./PinnedToken";
import { appTheme } from "util/appTheme";

const TokenSelection = ({
  tokenList,
  pinnedList,
  setTokenList,
  type,
  changePinned,
  resetLists,
  sortPinned,
}: {
  tokenList: TokenList["kind"];
  pinnedList: TokenList["kind"] | undefined;
  setTokenList: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
  type: string;
  changePinned: (token: TokenKind) => void;
  resetLists: () => void;
  sortPinned: ((token: TokenKind) => void) | undefined;
}) => {
  const [toggleFrom, togglerFrom] = useContext(modalToggle).toggleFrom;
  const [toggleTo, togglerTo] = useContext(modalToggle).toggleTo;
  const setterToken = useContext(modalToggle).selectedToken[1];
  const setterFluidToken = useContext(modalToggle).selectedFluidToken[1];

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
      <div className="token-list-item" key={`${index}${token}`}>
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
            // resetLists();
          }}
        />
        <img
          className="pin-icon"
          onClick={() => {
            changePinned(token);
            sortPinned && sortPinned(token);
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
    >
      <div className="connect-modal-body">
        <h2 className={`primary-text${appTheme}`}>Select a Token</h2>
        <TokenSearch
          setTokenListState={setTokenList}
          resetLists={resetLists}
          tokenList={tokenList}
        />
        <div className="pinned-tokens">
          {pinnedList &&
            pinnedList.map(
              (token: TokenKind, index: number) =>
                token.pinned && (
                  <PinnedToken
                    key={index}
                    token={token}
                    changePinned={changePinned}
                    sortPinned={sortPinned}
                    setTokenHandler={() => {
                      setToken(type, token.symbol);
                      resetLists();
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
                src="img/searchNotFound.svg"
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
