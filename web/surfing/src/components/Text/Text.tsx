import React from "react"
import styles from "./Text.module.scss"

type TextProps = {
    children: React.ReactNode,
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
    prominent?: boolean,
    className?: string,
    as?: "span" | "p",
}

const Text = ({ children, size="sm", as="span", prominent=false, ...props }: TextProps) => {
    const className = `${styles[size]} ${styles.text} ${prominent ? styles.prominent : ""} ${props.className || ""}`;
    const Component = as || "span";
    return <Component {...props} className={className}>
        {children}
    </Component>
}

export default Text;