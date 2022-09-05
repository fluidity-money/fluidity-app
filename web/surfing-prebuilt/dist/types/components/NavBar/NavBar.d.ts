/// <reference types="react" />
import type { IGeneralButtonProps } from "../Button/GeneralButton/GeneralButton";
interface INavLinks {
    name: string;
    modal: boolean;
    modalInfo?: IModalProps;
}
interface INavBarProps {
    logo: string;
    text: string;
    button: IGeneralButtonProps;
    navLinks: INavLinks[];
}
interface ILinkButton {
    children: string;
    size: "small" | "medium" | "large";
    type: "internal" | "external";
    handleClick: () => void;
}
interface IModalProps {
    navLinks: string[];
    modalButtons: ILinkButton[];
}
declare const NavBar: ({ logo, text, button, navLinks }: INavBarProps) => JSX.Element;
export default NavBar;
