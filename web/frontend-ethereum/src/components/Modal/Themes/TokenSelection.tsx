import { useContext } from "react";
import GenericModal from "components/Modal";
import { modalToggle } from "components/context";
import Button from "components/Button";
import {TokenKind, TokenList} from "components/types";

const TokenSelection = ({
  tokenList,
  type,
}: {
  tokenList: TokenList["kind"];
  type: string;
}) => {
  const [toggleFrom, togglerFrom] = useContext(modalToggle).toggleFrom;
  const [toggleTo, togglerTo] = useContext(modalToggle).toggleTo;
  const setterToken = useContext(modalToggle).selectedToken[1];
  const setterFluidToken = useContext(modalToggle).selectedFluidToken[1];

  const setToken = (type: string, value: TokenKind["type"], index: number) => {
    switch (type) {
      case "token":
        setterToken(value, index);
        togglerTo();
        return;
      case "fluid":
        setterFluidToken(value, index);
        togglerFrom();
        return;
      default:
        console.log("err");
    }
  };

  const renderedTokenSet = tokenList.map((token, index) => {
    return (
      <Button
      key={index}
      label={token.type}
      theme="token-button"
      texttheme="wallet-text"
      fontSize="font-large"
      icon={
        // nosemgrep: typescript.react.security.audit.react-http-leak.react-http-leak
        <img src={`${token.src}`} className="wallet-icon" alt={token.type} />
        }
        goto={() => setToken(type, token.type, index)}
      />
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
        <h2 className="primary-text">Select Your Token</h2>
        <div className="connect-modal-form">{renderedTokenSet}</div>
      </div>
    </GenericModal>
  );
};

export default TokenSelection;
