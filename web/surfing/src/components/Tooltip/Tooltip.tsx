import { Card } from '../Container/Card';
import { ICard } from '../Container/Card/Card';
import styles from './Tooltip.module.scss'

interface ITooltip extends Pick<ICard, "type" | "color" | "border"> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Tooltip = ({
  children,
  className,
  style = {},
  onMouseEnter,
  onMouseLeave,
  type = "frosted",
  color = "gray",
  border = "solid",
  ...props
}: ITooltip) => {
  return (
    <Card
      style={style}
      type={type}
      color={color}
      border={border}
      rounded
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={styles.Tooltip}
      {...props}
    >
      {children}
    </Card>
  );
};

export default Tooltip
