import { Text, Display } from "@fluidity-money/surfing";
import useViewport from "~/hooks/useViewport";
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

  const { width } = useViewport();
  const mobileView = width <= 375;


  return (
    <div className={classProps}>
      <Text size={mobileView ? "sm" : "md"}>{label}</Text>
      <div className={"value"}>
        {icon && <img src={icon} />}
        <Display className="row-value" size={mobileView ? "xxxs" : "xxs"}>
          {children}
        </Display>
      </div>
    </div>
  );
};

export default LabelledValue;
