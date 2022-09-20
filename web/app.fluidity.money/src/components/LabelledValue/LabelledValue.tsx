import { Text, Display } from "@fluidity-money/surfing";
import styles from "./LabelledValue.module.scss";

interface ITotalBalance extends HTMLDivElement {
  label: string;
  icon?: string;
}

const LabelledValue = ({icon, className, children}: ITotalBalance) => {
  const classNameProps = className || "";
  
  const classProps = `${styles.container} ${classNameProps}`;
  
  return (
    <div className={classProps}>
      <Text size={'md'}>Total balance</Text>
      {icon && <img src={icon} />}
      <Display small={true}>{children}</Display>
    </div>
  )
}

export default LabelledValue;
