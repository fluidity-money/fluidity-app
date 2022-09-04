import type { ButtonHTMLAttributes } from "react";
export interface IGeneralButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    children: string;
    version: "primary" | "secondary";
    type: "text" | "icon before" | "icon after" | "icon only";
    size: "small" | "medium" | "large";
    handleClick: () => void;
}
declare const GeneralButton: ({ children, version, type, size, handleClick, disabled, className, ...props }: IGeneralButtonProps) => JSX.Element;
export default GeneralButton;
