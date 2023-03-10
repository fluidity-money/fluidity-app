import styles from "./Text.module.scss";

type TextProps = {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
  prominent?: boolean;
  className?: string;
  style?: React.CSSProperties;
  bold?: boolean;
  holo?: boolean;
  as?: "span" | "p";
};

const Text = ({
  children,
  size = "sm",
  as = "span",
  prominent = false,
  bold = false,
  className,
  holo = false,
  style,
  ...props
}: TextProps) => {
  const classNameProps = className || "";

  const sizeProps = `${styles[size]}`;
  const prominentProps = `${prominent ? styles.prominent : ""}`;
  const boldProps = `${bold ? styles.bold : ""}`;
  const holoProps = `${holo ? styles.holo : ""}`;
  const classProps = `${styles.text} ${sizeProps} ${prominentProps} ${boldProps} ${classNameProps} ${holoProps}`;

  const Component = as || "span";
  return (
    <Component style={style} className={classProps} {...props}>
      {children}
    </Component>
  );
};

export default Text;
