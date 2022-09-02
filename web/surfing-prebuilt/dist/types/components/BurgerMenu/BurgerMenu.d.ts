/// <reference types="react" />
interface IBurgerMenuProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export declare const BurgerMenu: ({ isOpen, setIsOpen }: IBurgerMenuProps) => JSX.Element;
export default BurgerMenu;
