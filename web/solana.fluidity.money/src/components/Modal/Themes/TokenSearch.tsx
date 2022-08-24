// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import { FluidTokenList } from "util/hooks/useFluidTokens";

interface TokenSearchProps {
  setTokenListState: React.Dispatch<React.SetStateAction<FluidTokenList>>;
  tokenList: FluidTokenList;
  resetLists: () => void;
}

const TokenSearch = ({
  setTokenListState,
  tokenList,
  resetLists,
}: TokenSearchProps) => {
  const [searchInput, setSearchInput] = React.useState<string>("");

  const filterTokens = (text: string) => {
    // if text is empty full array
    if (text === "") resetLists();
    // if token match filter
    // if no match empty array
    else {
      const searchString = text.toLowerCase();
      setTokenListState(() =>
        [...tokenList].filter((token) => {
          return (
            token.token.name.toLowerCase().includes(searchString) ||
            token.token.symbol.toLowerCase().includes(searchString) ||
            token.token.address.toLowerCase() === searchString
          );
        })
      );
    }
  };

  return (
    <div className="token-search">
      <img className="search-icon" src="img/searchIcon.svg" alt="search" />
      <input
        type="text"
        // autoFocus
        placeholder="Search by name or paste address"
        onChange={(text: React.FormEvent<HTMLInputElement>) => {
          setSearchInput(text.currentTarget.value);
          filterTokens(text.currentTarget.value);
        }}
        onKeyDown={(text: any) => {
          if (text.keyCode === 8) {
            resetLists();
          }
        }}
        value={searchInput}
      />
      {searchInput.length ? (
        <img
          className="clear-icon"
          src="img/x.svg"
          alt="search"
          onClick={() => {
            setSearchInput("");
            resetLists();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TokenSearch;
