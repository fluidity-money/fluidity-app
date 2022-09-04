/// <reference types="react" />
import "./Heading.module.scss";
declare type Props = {
    children: React.ReactNode;
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};
declare const Heading: ({ children, as, ...props }: Props & unknown) => JSX.Element;
export default Heading;
