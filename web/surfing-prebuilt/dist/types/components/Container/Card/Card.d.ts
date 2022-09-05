/// <reference types="react" />
interface ICard {
    component?: "div" | "button" | "tr";
    rounded?: boolean;
    type?: "gray" | "box" | "holobox" | "transparent";
    [_: string]: any;
}
declare const Card: ({ component, rounded, className, children, type, ...props }: ICard) => JSX.Element;
export default Card;
