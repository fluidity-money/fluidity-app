import type { ButtonHTMLAttributes, ReactComponentElement } from "react";

import styles from "./FilterButton.module.scss";

interface IOption {
  name: string;
  selected: boolean;
  icon: ReactComponentElement;
}

interface IFilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  disabled,
  className,
  ...props
}: IFilterButtonProps) => {
  const classProps = className || "";
  
  const optionName = option.name.includes("any") 
    ? "ANY"
    : option.name;
  
  return (
    <>
      {option.selected ? (
        <button
          className={`${styles.optionSelected} ${classProps}`}
          onClick={() => handleFilter(option, setOptions, options)}
          {...props}
        >
          {optionName}
        </button>
      ) : (
        <button
          className={`${styles.option} ${classProps}`}
          onClick={() => disabled !== true && handleFilter(option, setOptions, options)}
          disabled={disabled}
          {...props}
        >
          {optionName}
        </button>
      )}
    </>
  );
};

export default FilterButton;
