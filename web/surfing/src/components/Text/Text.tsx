import styles from "./Text.module.scss";

type TextProps = {
  children: React.ReactNode;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
  prominent?: boolean;
  className?: string;
  style?: React.CSSProperties;
  bold?: boolean;
  holo?: boolean;
  code?: boolean;
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
  code = false,
  ...props
}: TextProps) => {
  const classNameProps = className || "";

  const sizeProps = `${styles[size]}`;
  const prominentProps = `${prominent ? styles.prominent : ""}`;
  const boldProps = `${bold ? styles.bold : ""}`;
  const holoProps = `${holo ? styles.holo : ""}`;
  const codeProps = `${code ? styles.code : ""}`;
  const classProps = `${styles.text} ${sizeProps} ${prominentProps} ${boldProps} ${holoProps} ${codeProps} ${classNameProps}`;

  const Component = as || "span";
  return (
    <Component style={style} className={classProps} {...props}>
      {children}
    </Component>
  );
};

export default Text;
