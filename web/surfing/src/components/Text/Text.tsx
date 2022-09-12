import React from "react"
import styles from "./Text.module.scss"

type TextProps = {
    children: React.ReactNode,
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
    prominent?: boolean,
    className?: string,
    as?: "span" | "p",
    center ?: boolean
}

const Text = ({ children, size="sm", as="span", prominent=false, className, center, ...props }: TextProps) => {
    const sizeProps = `${styles[size]}`
    const prominentProps = `${prominent ? styles.prominent : ""}`
    const classNameProps = `${className || ""}`

    const propCenter = center ? styles.center : "";

    const classProps =
      `${styles.text} ${sizeProps} ${prominentProps} ${classNameProps} ${propCenter}`;

    const Component = as || "span";

    return <Component {...props} className={classProps}>
        {children}
    </Component>
}

export default Text;