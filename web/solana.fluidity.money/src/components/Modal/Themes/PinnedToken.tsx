// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
