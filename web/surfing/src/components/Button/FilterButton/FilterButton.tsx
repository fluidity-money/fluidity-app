import type {ButtonHTMLAttributes} from "react";

import styles from "./FilterButton.module.scss";

interface IOption {
  name: string;
  selected: boolean;
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
}: IFilterButtonProps) => {
  return (
    <>
      {option.selected ? (
        <button
          className={styles.optionSelected}
          onClick={() => handleFilter(option, setOptions, options)}
        >
          {option.name.includes("any") ? "ANY" : option.name}
        </button>
      ) : (
        <button
          className={styles.option}
          onClick={() => disabled !== true && handleFilter(option, setOptions, options)}
          disabled={disabled}
        >
          {option.name.includes("any") ? "ANY" : option.name}
        </button>
      )}
    </>
  );
};

export default FilterButton;
