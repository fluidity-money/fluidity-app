import { TokenKind } from "components/types";

interface PinnedTokenProps {
  token: TokenKind;
  changePinned: (token: string) => void;
  changeOtherPinned: (token: TokenKind) => void;
  setTokenHandler: () => void;
}

const PinnedToken = ({
  token,
  changePinned,
  changeOtherPinned,
  setTokenHandler,
}: PinnedTokenProps) => {
  return (
    <div className="pinned">
      <div
        className="pinned-content"
        onClick={() => {
          setTokenHandler();
        }}
      >
        <img className="pinned-logo" src={token.image} alt="token" />

        <div className="pinned-symbol">{token.symbol}</div>
      </div>
      <div className="remove-pin">
        <img
          src="img/close-button.svg"
          alt="x"
          onClick={() => {
            changePinned(token.symbol);
            changeOtherPinned(token);
          }}
        />
      </div>
    </div>
  );
};

export default PinnedToken;
