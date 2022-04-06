import { TokenKind } from "components/types";

interface PinnedTokenProps {
  token: TokenKind;
  changePinned: (token: string) => void;
  setTokenHandler: () => void;
}

const PinnedToken = ({
  token,
  changePinned,
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

        <div className="pinned-symbol">{token.image}</div>
      </div>
      <div className="remove-pin">
        <img
          src="img/close-button.svg"
          alt="x"
          onClick={() => changePinned(token.image)}
        />
      </div>
    </div>
  );
};

export default PinnedToken;
