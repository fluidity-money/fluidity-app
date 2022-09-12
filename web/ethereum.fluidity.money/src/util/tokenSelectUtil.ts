// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE.md file.

import { TokenKind, TokenList } from "components/types";

export // changes token and fluid pair token from pinned to unpinned if less than 8 pinned
const changePinnedUtil = (
  token: TokenKind,
  tokens: TokenList["kind"],
  setPinnedTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setPinnedFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>
) => {
  // size and filter to determine if 8 are pinned already and the current selected can be pinned/unpinned
  const size = tokens.filter(
    (selectedToken) => selectedToken.pinned === true
  ).length;
  if (size < 8 || (size === 8 && token.pinned === true)) {
    setPinnedTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setPinnedFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === `f${token.symbol}`
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === `f${token.symbol}`
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
  }
};

// changes fluid token and regulat token from pinned to unpinned if less than 8 pinned
export const changePinnedFluidUtil = (
  token: TokenKind,
  fluidTokens: TokenList["kind"],
  setPinnedTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setPinnedFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>
) => {
  // size and filter to determine if 8 are pinned already and the current selected can be pinned/unpinned
  const size = fluidTokens.filter(
    (selectedToken) => selectedToken.pinned === true
  ).length;
  if (size < 8 || (size === 8 && token.pinned === true)) {
    setPinnedTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol.substring(1)
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setPinnedFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol.substring(1)
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
    setFluidTokens((previousState: TokenList["kind"]) =>
      [...previousState]?.map((item) =>
        item.symbol === token.symbol
          ? Object.assign(item, { pinned: !item.pinned })
          : item
      )
    );
  }
};

// sorts pinned tokens in order when added
export const sortPinnedUtil = (
  token: TokenKind,
  setPinnedTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setPinnedFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  pinnedTokens: TokenKind[],
  pinnedFluidTokens: TokenKind[]
) => {
  setPinnedTokens(
    [...pinnedTokens].sort((y, x) => {
      return x.symbol === token.symbol ? -1 : y.symbol === token.symbol ? 1 : 0;
    })
  );
  setPinnedFluidTokens(
    [...pinnedFluidTokens].sort((y, x) => {
      return x.symbol === `f${token.symbol}`
        ? -1
        : y.symbol === `f${token.symbol}`
        ? 1
        : 0;
    })
  );
};

// sorts pinned fluid when added
export const sortPinnedFluidUtil = (
  token: TokenKind,
  setPinnedTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  setPinnedFluidTokens: React.Dispatch<React.SetStateAction<TokenList["kind"]>>,
  pinnedTokens: TokenKind[],
  pinnedFluidTokens: TokenKind[]
) => {
  setPinnedFluidTokens(
    [...pinnedFluidTokens].sort((y, x) => {
      return x.symbol === token.symbol ? -1 : y.symbol === token.symbol ? 1 : 0;
    })
  );
  setPinnedTokens(
    [...pinnedTokens].sort((y, x) => {
      return x.symbol === token.symbol.substring(1)
        ? -1
        : y.symbol === token.symbol.substring(1)
        ? 1
        : 0;
    })
  );
};
