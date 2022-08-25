interface IOption {
  name: string;
  selected: boolean;
}

// updates button option from selected to not selected
export const handleFilterButton = (
  option: IOption,
  setOption: React.Dispatch<React.SetStateAction<IOption[]>>
) => {
  // if option is any and it isn't selected, make any selected and clear options
  if (option.name.includes("any") && option.selected === false) {
    setOption((previousState) =>
      previousState.map((item) => {
        if (item.name.includes("any")) {
          return item;
        }
        return { ...item, selected: false };
      })
    );
  }

  // if option isn't any, and isn't selected, unselect any
  if (!option.name.includes("any") && option.selected === false) {
    setOption((previousState) =>
      previousState.map((item) => {
        if (!item.name.includes("any")) {
          return item;
        }
        return { ...item, selected: false };
      })
    );
  }
  // invert option
  setOption((previousState) =>
    previousState.map((item) => {
      // if it isn't the same or if it is any and selected, no change
      if (
        item.name !== option.name ||
        (item.name.includes("any") && item.selected === true)
      ) {
        return item;
      }
      // invert button type
      return { ...item, selected: !option.selected };
    })
  );
};

export // clear filterList of the options related to it's specific any
const clearForAny = (
  option: IOption,
  setFilterList: React.Dispatch<React.SetStateAction<string[]>>
) => {
  if (option.name === "anyCat") {
    setFilterList((initalState) =>
      initalState.filter(
        (item) =>
          ![
            "defi",
            "dex",
            "nft",
            "gaming",
            "payments",
            "metaverse",
            "dao",
          ].includes(item)
      )
    );
  }
  if (option.name === "anyChain") {
    setFilterList((initalState) =>
      initalState.filter(
        (item) => !["ethereum", "polygon", "solana"].includes(item)
      )
    );
  }
  if (option.name === "anyYear") {
    setFilterList((initalState) =>
      initalState.filter((item) => !["2020", "2021", "2022"].includes(item))
    );
  }
};
