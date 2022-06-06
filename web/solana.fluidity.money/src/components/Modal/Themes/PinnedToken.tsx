import { TokenInfo } from "util/hooks/useFluidTokens";

interface PinnedTokenProps {
  token: TokenInfo;
  changePinned: (token: TokenInfo) => void;
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
        <img className="pinned-logo" src={token.config.image} alt="token" />

        <div className="pinned-symbol">{token.token.symbol}</div>
      </div>
      <div className="remove-pin">
        <img
          src="img/close-button.svg"
          alt="x"
          onClick={() => {
            changePinned(token);
          }}
        />
      </div>
    </div>
  );
};

export default PinnedToken;
