import type { ButtonHTMLAttributes } from "react";
interface ILinkButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    children: string;
    size: "small" | "medium" | "large";
    type: "internal" | "external";
    handleClick: () => void;
}
declare const LinkButton: ({ children, size, type, handleClick, className, ...props }: ILinkButtonProps) => JSX.Element;
export default LinkButton;
