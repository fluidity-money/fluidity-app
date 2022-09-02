/// <reference types="react" />
interface IOption {
    name: string;
    selected: boolean;
}
interface IFilterCriteriaProps {
    children: string;
    options: IOption[];
    setOptions: React.SetStateAction<any>;
    handleFilter: (option: IOption, setOption: React.SetStateAction<any>, options: IOption[]) => void;
}
declare const FilterCriteria: ({ children, options, handleFilter, setOptions, }: IFilterCriteriaProps) => JSX.Element;
export default FilterCriteria;
