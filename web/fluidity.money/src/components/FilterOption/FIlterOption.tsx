import React from "react";
import styles from "./FilterOption.module.scss";

interface IOption {
  name: string;
  selected: boolean;
}

interface IFilterOptionProps {
  option: IOption;
  setOptions: React.SetStateAction<any>;
  handleFilter: (
    option: IOption,
    setOption: React.SetStateAction<any>,
    options: IOption[]
  ) => void;
  options: IOption[];
}

const FIlterOption = ({
  option,
  handleFilter,
  setOptions,
  options,
}: IFilterOptionProps) => {
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

export default FIlterOption;
