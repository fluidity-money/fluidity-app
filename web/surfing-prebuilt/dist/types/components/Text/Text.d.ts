import React from "react";
declare type TextProps = {
    children: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    prominent?: boolean;
    className?: string;
    as?: "span" | "p";
};
declare const Text: ({ children, size, as, prominent, ...props }: TextProps) => JSX.Element;
export default Text;
