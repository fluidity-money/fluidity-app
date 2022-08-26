import "./Heading.scss";

type Props = {
    children: React.ReactNode;
    as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const Heading = ({ children, as, ...props }: Props & unknown) => {
    const Component = as || "h1";
    return <Component {...props}>
        {children}
    </Component>
};

export default Heading;