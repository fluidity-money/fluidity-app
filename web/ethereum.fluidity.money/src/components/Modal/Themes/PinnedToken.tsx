// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { TokenKind } from "components/types";

interface PinnedTokenProps {
  token: TokenKind;
  changePinned: (token: TokenKind) => void;
  sortPinned: ((token: TokenKind) => void) | undefined;
  setTokenHandler: () => void;
}

const PinnedToken = ({
  token,
  changePinned,
  sortPinned,
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
            changePinned(token);
            sortPinned && sortPinned(token);
          }}
        />
      </div>
    </div>
  );
};

export default PinnedToken;
