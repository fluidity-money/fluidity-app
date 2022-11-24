import styles from "./Text.module.scss"

type TextProps = {
    children: React.ReactNode,
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
    prominent?: boolean,
    className?: string,
    bold?: boolean,
    as?: "span" | "p",
}

const Text = ({ children, size="sm", as="span", prominent=false, bold=false, className, ...props }: TextProps) => {
    const classNameProps = className || "";

    const sizeProps = `${styles[size]}`
    const prominentProps = `${prominent ? styles.prominent : ""}`
    const boldProps = `${bold ? styles.bold : ""}`
    const classProps = `${styles.text} ${sizeProps} ${prominentProps} ${boldProps} ${classNameProps}`;

    const Component = as || "span";
    return <Component className={classProps} {...props}>
        {children}
    </Component>
}

export default Text;