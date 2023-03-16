interface ITooltip {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

import { Card } from '../Container';
import styles from './Tooltip.module.scss'

const Tooltip = ({
  children,
  className,
  style = {},
  onMouseEnter,
  onMouseLeave,
  ...props
}: ITooltip) => {
  return (
    <Card 
      style={style} 
      type="frosted" 
      rounded 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave} 
      className={styles.Tooltip}
    >
      {children}
    </Card>
  );
};

export default Tooltip
