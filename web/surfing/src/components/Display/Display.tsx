import "./Display.scss";

type Props = {
    children: React.ReactNode;
    extraSmall?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;

    [key: string]: any;
};

const Display = ({ children, ...props }: Props & unknown) => {
    const sizeMap = {
        "extraSmall": "xs",
        "small": "sm",
        "medium": "md",
        "large": "lg",
    };

    const size = Object.entries(sizeMap).reduce((acc, [key, value]) => {
        if (props[key]) {
            return value;
        }
        return acc;
    }, "lg"); // Large is default if no size is specified.

    const propClasses = props.className || "";

    const className = `${size} ${propClasses}`;
    return <h1 {...props } className={className} >
        {children}
    </h1>
};

export default Display;