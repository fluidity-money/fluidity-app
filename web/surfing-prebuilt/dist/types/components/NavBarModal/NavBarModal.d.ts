/// <reference types="react" />
interface INavBarModal {
    handleModal: () => void;
    navLinks: ILinkButton[];
}
interface ILinkButton {
    children: string;
    size: "small" | "medium" | "large";
    type: "internal" | "external";
    handleClick: () => void;
}
declare const NavBarModal: ({ handleModal, navLinks }: INavBarModal) => JSX.Element;
export default NavBarModal;
