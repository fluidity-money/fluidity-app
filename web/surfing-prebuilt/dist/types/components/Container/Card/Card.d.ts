import type { ComponentType, HTMLProps } from "react";
interface IContainer extends HTMLProps<HTMLDivElement> {
    component: ComponentType<any> | ((...args: any[]) => JSX.Element);
    rounded?: boolean;
    type?: "gray" | "box";
}
declare const Container: ({ component, rounded, className, children, type, ...props }: IContainer) => JSX.Element;
export default Container;
