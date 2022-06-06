import { FluidTokenList, TokenInfo } from "./hooks/useFluidTokens";
// This file is predominantly to clean up the TokenSelect component and functions used within

// function used to set token amounts
export const setAmountUtil = (
  token: TokenInfo,
  r: string,
  setTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>
) => {
  setTokens((previousState: FluidTokenList) =>
    [...previousState]?.map((item) =>
      item.token.symbol === token.token.symbol
        ? Object.assign({}, item, {
            config: Object.assign({}, item.config, {
              amount: r,
            }),
          })
        : item
    )
  );
};

// function to changed if a token and its fluid conterpart are pinned or not
export const changePinnedUtil = (
  token: TokenInfo,
  selectTokens: FluidTokenList,
  setSelectPinnedTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>,
  setSelectPinnedFluidTokens: React.Dispatch<
    React.SetStateAction<FluidTokenList>
  >,
  setSelectTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>,
  setSelectFluidTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>
) => {
  // size and filter to determine if 8 are pinned already and the current selected can be pinned/unpinned
  const size = selectTokens.filter((x) => x.config.pinned === true).length;

  if (size < 8 || (size === 8 && token.config.pinned === true)) {
    setSelectPinnedTokens((previousState: FluidTokenList) =>
      [...previousState]
        ?.map((item) =>
          item.token.symbol === token.token.symbol
            ? Object.assign({}, item, {
                config: Object.assign({}, item.config, {
                  pinned: !item.config.pinned,
                }),
              })
            : item
        )
        //sorts pinned in order when new added/removed
        .sort((y, x) => {
          return x.token.symbol === token.token.symbol
            ? -1
            : y.token.symbol === token.token.symbol
            ? 1
            : 0;
        })
    );
    setSelectPinnedFluidTokens((previousState: FluidTokenList) =>
      [...previousState]
        ?.map((item) =>
          item.token.symbol === `f${token.token.symbol}`
            ? Object.assign({}, item, {
                config: Object.assign({}, item.config, {
                  pinned: !item.config.pinned,
                }),
              })
            : item
        )
        //sorts pinned in order when new added/removed
        .sort((y, x) => {
          return x.token.symbol === `f${token.token.symbol}`
            ? -1
            : y.token.symbol === `f${token.token.symbol}`
            ? 1
            : 0;
        })
    );
    setSelectTokens((previousState: FluidTokenList) =>
      [...previousState]?.map((item) =>
        item.token.symbol === token.token.symbol
          ? Object.assign({}, item, {
              config: Object.assign({}, item.config, {
                pinned: !item.config.pinned,
              }),
            })
          : item
      )
    );
    setSelectFluidTokens((previousState: FluidTokenList) =>
      [...previousState]?.map((item) =>
        item.token.symbol === `f${token.token.symbol}`
          ? Object.assign({}, item, {
              config: Object.assign({}, item.config, {
                pinned: !item.config.pinned,
              }),
            })
          : item
      )
    );
  }
};

// changes fluid token and regular token from pinned to unpinned if less than 8 pinned
export const changePinnedFluidUtil = (
  token: TokenInfo,
  selectFluidTokens: FluidTokenList,
  setSelectPinnedTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>,
  setSelectPinnedFluidTokens: React.Dispatch<
    React.SetStateAction<FluidTokenList>
  >,
  setSelectTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>,
  setSelectFluidTokens: React.Dispatch<React.SetStateAction<FluidTokenList>>
) => {
  // size and filter to determine if 8 are pinned already and the current selected can be pinned/unpinned
  const size = selectFluidTokens.filter((x) => x.config.pinned === true).length;

  if (size < 8 || (size === 8 && token.config.pinned === true)) {
    setSelectPinnedTokens((previousState: FluidTokenList) =>
      [...previousState]
        ?.map((item) =>
          item.token.symbol === token.token.symbol.substring(1)
            ? Object.assign({}, item, {
                config: Object.assign({}, item.config, {
                  pinned: !item.config.pinned,
                }),
              })
            : item
        )
        //sorts pinned in order when new added/removed
        .sort((y, x) => {
          return x.token.symbol === token.token.symbol.substring(1)
            ? -1
            : y.token.symbol === token.token.symbol.substring(1)
            ? 1
            : 0;
        })
    );
    setSelectPinnedFluidTokens((previousState: FluidTokenList) =>
      [...previousState]
        ?.map((item) =>
          item.token.symbol === token.token.symbol
            ? Object.assign({}, item, {
                config: Object.assign({}, item.config, {
                  pinned: !item.config.pinned,
                }),
              })
            : item
        )
        //sorts pinned in order when new added/removed
        .sort((y, x) => {
          return x.token.symbol === token.token.symbol
            ? -1
            : y.token.symbol === token.token.symbol
            ? 1
            : 0;
        })
    );
    setSelectTokens((previousState: FluidTokenList) =>
      [...previousState]?.map((item) =>
        item.token.symbol === token.token.symbol.substring(1)
          ? Object.assign({}, item, {
              config: Object.assign({}, item.config, {
                pinned: !item.config.pinned,
              }),
            })
          : item
      )
    );
    setSelectFluidTokens((previousState: FluidTokenList) =>
      [...previousState]?.map((item) =>
        item.token.symbol === token.token.symbol
          ? Object.assign({}, item, {
              config: Object.assign({}, item.config, {
                pinned: !item.config.pinned,
              }),
            })
          : item
      )
    );
  }
};
