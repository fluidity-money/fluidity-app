import { TokenList } from "components/types";
import React from "react";

interface TokenSearchProps {
  setTokenListState: React.Dispatch<React.SetStateAction<TokenList["kind"]>>;
  tokenList: TokenList["kind"];
}

const TokenSearch = ({ setTokenListState, tokenList }: TokenSearchProps) => {
  const [searchInput, setSearchInput] = React.useState<string>("");

  const filterTokens = (text: string) => {
    // if text is empty full array
    if (text === "") setTokenListState(tokenList);
    // if token match filter
    // if no match empty array
    else {
      const searchString = text.toLowerCase();
      setTokenListState(() =>
        [...tokenList].filter((token) => {
          return (
            token.name.toLowerCase().includes(searchString) ||
            token.symbol.toLowerCase().includes(searchString) ||
            token.address.toLowerCase() === searchString
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
        autoFocus
        placeholder="Search by name paste address"
        onChange={(text: React.FormEvent<HTMLInputElement>) => {
          setSearchInput(text.currentTarget.value);
          filterTokens(text.currentTarget.value);
        }}
        value={searchInput}
      />
      {searchInput.length ? (
        <img
          className="clear-search-icon"
          src="img/x.svg"
          alt="search"
          onClick={() => {
            setSearchInput("");
            setTokenListState(tokenList);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TokenSearch;
