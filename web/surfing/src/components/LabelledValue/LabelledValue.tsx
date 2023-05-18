import { Text, Display } from "~/components";
import useViewport from "~/util/hooks/useViewport";
import styles from "./LabelledValue.module.scss";

type ILabelledValue = {
  children: React.ReactNode;
  className?: string;
  label: string | React.ReactNode;
  icon?: string | React.ReactNode;
  align?: "left" | "right" | "center";
};

const LabelledValue = ({
  icon,
  className,
  children,
  label,
  align = "left",
}: ILabelledValue) => {
  const classNameProps = className || "";

  const classProps = `${styles.container} ${classNameProps} ${styles[align]}`;

  const { width } = useViewport();
  const mobileView = width <= 500;

  return (
    <div className={classProps}>
      <Text size={mobileView ? "sm" : "md"}>{label}</Text>
      <div className={styles.value}>
        {icon && typeof icon === "string" ? (
          <img className={styles.icon} src={icon} />
        ) : (
          icon
        )}
        <Display
          className={styles.noPadding}
          size={mobileView ? "xxxs" : "xxs"}
        >
          {children}
        </Display>
      </div>
    </div>
  );
};

export default LabelledValue;
