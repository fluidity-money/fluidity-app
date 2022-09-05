/// <reference types="react" />
declare type DisplayProps = {
    children: React.ReactNode;
    extraSmall?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    [key: string]: any;
};
declare const Display: ({ children, large, ...props }: DisplayProps) => JSX.Element;
export default Display;
