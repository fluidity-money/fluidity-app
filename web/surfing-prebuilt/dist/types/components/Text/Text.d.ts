import type { HTMLProps } from "react";
interface IText extends HTMLProps<HTMLParagraphElement> {
    as: "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
    bold?: boolean;
    underline?: boolean;
    colour?: "default" | "disabled" | "white" | "black";
}
declare const Text: ({ children, className, as, colour, bold, underline, ...props }: IText) => JSX.Element;
export default Text;
