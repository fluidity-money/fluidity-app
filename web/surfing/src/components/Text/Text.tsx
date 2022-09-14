import styles from "./Text.module.scss"

type TextProps = {
    children: React.ReactNode,
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
    prominent?: boolean,
    className?: string,
    as?: "span" | "p",
}

const Text = ({ children, size="sm", as="span", prominent=false, className, ...props }: TextProps) => {
    const classNameProps = className || "";

    const sizeProps = `${styles[size]}`
    const prominentProps = `${prominent ? styles.prominent : ""}`
    const classProps = `${styles.text} ${sizeProps} ${prominentProps} ${classNameProps}`;

    const Component = as || "span";
    return <Component className={classProps} {...props}>
        {children}
    </Component>
}

export default Text;