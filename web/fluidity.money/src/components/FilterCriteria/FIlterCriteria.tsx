// Copyright 2022 Fluidity Money. All rights reserved. Use of this source
// code is governed by a commercial license that can be found in the
// LICENSE_TRF.md file.

import { FilterButton } from "@fluidity-money/surfing";
import React from "react";
import styles from "./FilterCriteria.module.scss";

interface IOption {
  name: string;
  selected: boolean;
}

interface IFilterCriteriaProps {
  children: string;
  options: IOption[];
  setOptions: React.SetStateAction<any>;
  handleFilter: (
    option: IOption,
    setOption: React.SetStateAction<any>,
    options: IOption[]
  ) => void;
}

const FilterCriteria = ({
  children,
  options,
  handleFilter,
  setOptions,
}: IFilterCriteriaProps) => {
  return (
    <div className={styles.container}>
      <h5>{children}</h5>
      <div className={styles.options}>
        {options.map((option) => (
          <FilterButton
            option={option}
            handleFilter={handleFilter}
            setOptions={setOptions}
            options={options}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterCriteria;
