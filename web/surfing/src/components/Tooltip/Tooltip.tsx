interface ITooltip {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

import { Card } from '../Container';
import styles from './Tooltip.module.scss'

const Tooltip = ({
  children,
  className,
  style = {},
  ...props
}: ITooltip) => {
  return (
    <Card style={{...style, padding: '1em'}} type="frosted" rounded>
      {children}
    </Card>
  );
};

export default Tooltip
