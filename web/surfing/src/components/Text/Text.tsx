import styles from "./Text.module.scss"

type TextProps = {
  children: React.ReactNode,
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
  prominent?: boolean,
  className?: string,
  as?: "span" | "p",
  noMargin ?: boolean,
  center ?: boolean;
}

const Text = ({
  children,
  size="sm",
  as="span",
  prominent=false,
  className,
  center,
  noMargin,
  ...props }: TextProps) =>
{
  const sizeProps = `${styles[size]}`
  const prominentProps = `${prominent ? styles.prominent : ""}`
  const classNameProps = `${className || styles.text}`

  const centerProp = center ? styles.center : "";

  const Component = as || "span";

  const classProps = `${classNameProps} ${prominentProps} ${sizeProps} ${centerProp}`;

  return (
    <Component className={classProps} {...props}>
      {children}
   </Component>
  );
}

export default Text;
