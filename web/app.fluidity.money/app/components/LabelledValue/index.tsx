import { Text, Display } from "@fluidity-money/surfing";
import styles from "./styles.css";

export const links = () => [{ rel: "stylesheet", href: styles }];

type ILabelledValue = {
  children: React.ReactNode;
  className?: string;
  label: string;
  icon?: string;
};

const LabelledValue = ({
  icon,
  className,
  children,
  label,
}: ILabelledValue) => {
  const classNameProps = className || "";

  const classProps = `container ${classNameProps}`;

  return (
    <div className={classProps}>
      <Text size={"md"}>{label}</Text>
      <div className={"value"}>
        {icon && <img src={icon} />}
        <Display className="row-value" extraSmall={true}>
          {children}
        </Display>
      </div>
    </div>
  );
};

export default LabelledValue;
