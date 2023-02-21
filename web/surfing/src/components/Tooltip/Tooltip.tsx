interface ITooltip {
  children: React.ReactNode;
  className?: string;
}

import { Card } from '../Container';
import styles from './Tooltip.module.scss'

const Tooltip = ({
  children,
  className,
  ...props
}: ITooltip) => {
  return (
    <Card type="frosted" rounded>
      <div
        style={{padding: '1em'}}
      >
      {children}
      </div>
    </Card>
  );
};

export default Tooltip