/// <reference types="react" />
declare type Props = {
    children: React.ReactNode;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    className?: string;
};
declare const Heading: ({ children, as, className, ...props }: Props & unknown) => JSX.Element;
export default Heading;
