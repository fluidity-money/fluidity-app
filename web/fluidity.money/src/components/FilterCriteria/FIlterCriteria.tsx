import React from "react";
import FilterOption from "../FilterOption";
import styles from "./FilterCriteria.module.scss";

interface IFilterCriteriaProps {
  children: string;
  options: string[];
}

const FIlterCriteria = ({ children, options }: IFilterCriteriaProps) => {
  return (
    <div className={styles.container}>
      <h5>{children}</h5>
      <div className={styles.options}>
        {options.map((option) => (
          <FilterOption name={option} />
        ))}
      </div>
    </div>
  );
};

export default FIlterCriteria;
