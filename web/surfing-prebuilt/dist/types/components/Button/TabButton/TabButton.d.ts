import type { ButtonHTMLAttributes } from "react";
interface ITabButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size: "default" | "small";
    children: string;
}
declare const TabButton: ({ children, size, className, ...props }: ITabButtonProps) => JSX.Element;
export default TabButton;
