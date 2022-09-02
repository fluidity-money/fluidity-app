import type { ButtonHTMLAttributes } from "react";
interface IOption {
    name: string;
    selected: boolean;
}
interface IFilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    option: IOption;
    setOptions: React.SetStateAction<any>;
    handleFilter: (option: IOption, setOption: React.SetStateAction<any>, options: IOption[]) => void;
    options: IOption[];
}
declare const FilterButton: ({ option, handleFilter, setOptions, options, disabled, className, ...props }: IFilterButtonProps) => JSX.Element;
export default FilterButton;
