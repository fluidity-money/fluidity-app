import type { HTMLProps } from "react";
interface IRowProps extends HTMLProps<HTMLDivElement> {
    reverse?: boolean;
}
declare const Row: ({ children, className, reverse, ...props }: IRowProps) => JSX.Element;
export default Row;
