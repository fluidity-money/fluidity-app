import type { ButtonHTMLAttributes } from "react";
interface IAnchorButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}
declare const AnchorButton: ({ children, disabled, className, ...props }: IAnchorButtonProps) => JSX.Element;
export default AnchorButton;
