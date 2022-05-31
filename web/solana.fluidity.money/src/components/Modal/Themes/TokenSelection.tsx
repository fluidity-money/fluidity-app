import { useContext } from "react";
import GenericModal from "components/Modal";
import { ModalToggle } from "components/context";
import Button from "components/Button";
import { TokenKind, TokenList } from "components/types";
import {
  FluidTokenList,
  FluidTokens,
  TokenInfo,
} from "util/hooks/useFluidTokens";
import TokenSearch from "./TokenSearch";
import PinnedToken from "./PinnedToken";

const TokenSelection = ({
  tokenList,
  pinnedList,
  setTokenList,
  type,
  changePinned,
  resetLists,
}: {
  tokenList: FluidTokenList;
  pinnedList: FluidTokenList;
  setTokenList: React.Dispatch<React.SetStateAction<FluidTokenList>>;
  type: string;
  changePinned: (token: TokenInfo) => void;
  resetLists: () => void;
}) => {
  const [toggleFrom, togglerFrom] = useContext(ModalToggle).toggleFrom;
  const [toggleTo, togglerTo] = useContext(ModalToggle).toggleTo;
  const setterToken = useContext(ModalToggle).selectedToken[1];
  const setterFluidToken = useContext(ModalToggle).selectedFluidToken[1];

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

  const renderedTokenSet = tokenList.map(
    (item, index, tokenList, { token, config } = item) => {
      return (
        <div className="token-list-item" key={`${index}${token}`}>
          <Button
            key={index}
            label={token.symbol}
            token={item}
            theme="select-token-button"
            texttheme="select-token-text"
            fontSize="font-large"
            icon={
              // nosemgrep
              <img
                src={`${config.image}`}
                className="token-list-icon"
                alt={token.symbol}
              />
            }
            goto={() => setToken(type, token.symbol as TokenKind["symbol"])}
          />
          <img
            className="pin-icon"
            onClick={() => {
              changePinned(item);
            }}
            src={config.pinned ? "img/pinnedIcon.svg" : "img/pinIcon.svg"}
            alt="pin"
          />
        </div>
      );
    }
  );

  return (
    <GenericModal
      enable={type === "token" ? toggleTo : toggleFrom}
      toggle={type === "token" ? togglerTo : togglerFrom}
      height="auto"
      // width="20rem"
    >
      <div className="connect-modal-body">
        <h2 className="primary-text">Select Your Token</h2>
        <TokenSearch
          setTokenListState={setTokenList}
          resetLists={resetLists}
          tokenList={tokenList}
        />
        <div className="pinned-tokens">
          {pinnedList &&
            pinnedList.map(
              (item, index, tokenList, { token, config } = item) =>
                config.pinned && (
                  <PinnedToken
                    key={index}
                    token={item}
                    changePinned={changePinned}
                    setTokenHandler={() => {
                      setToken(type, token.symbol as TokenKind["symbol"]);
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
        <div className=" token-list">
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
