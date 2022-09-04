/// <reference types="react" />
import "./Display.scss";
declare type Props = {
    children: React.ReactNode;
    extraSmall?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    [key: string]: any;
};
declare const Display: ({ children, ...props }: Props & unknown) => JSX.Element;
export default Display;
