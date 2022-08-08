import React from "react";
import FilterOption from "../FilterOption";
import styles from "./FilterCriteria.module.scss";

interface IOption {
  name: string;
  selected: boolean;
}

interface IFilterCriteriaProps {
  children: string;
  options: IOption[];
  setOptions: React.SetStateAction<any>;
  handleFilter: (option: IOption, setOption: React.SetStateAction<any>) => void;
}

const FIlterCriteria = ({
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
          <FilterOption
            option={option}
            handleFilter={handleFilter}
            setOptions={setOptions}
          />
        ))}
      </div>
    </div>
  );
};

export default FIlterCriteria;
