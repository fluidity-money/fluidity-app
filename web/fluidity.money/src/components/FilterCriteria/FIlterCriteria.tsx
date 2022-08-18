import { FilterButton } from "components/Button";
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
