// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import React from "react";
import styles from "./FilterButton.module.scss";

interface IOption {
  name: string;
  selected: boolean;
}

interface IFilterButtonProps {
  option: IOption;
  setOptions: React.SetStateAction<any>;
  handleFilter: (
    option: IOption,
    setOption: React.SetStateAction<any>,
    options: IOption[]
  ) => void;
  options: IOption[];
}

const FilterButton = ({
  option,
  handleFilter,
  setOptions,
  options,
}: IFilterButtonProps) => {
  return (
    <>
      {option.selected ? (
        <div
          className={styles.optionSelected}
          onClick={() => handleFilter(option, setOptions, options)}
        >
          {option.name.includes("any") ? "ANY" : option.name.toUpperCase()}
        </div>
      ) : (
        <div
          className={styles.option}
          onClick={() => handleFilter(option, setOptions, options)}
        >
          {option.name.includes("any") ? "ANY" : option.name.toUpperCase()}
        </div>
      )}
    </>
  );
};

export default FilterButton;
