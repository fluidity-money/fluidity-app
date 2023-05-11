import { motion } from 'framer-motion'
import Card, { ICard } from '../Container/Card/Card'
import styles from './ProgressBar.module.scss'

interface IProgressBar extends ICard {
  value: number
  max: number
  border?: "solid" | "dashed" | "none";
  color?: "gray" | "white" | "holo"
  size?: 'sm' | 'md' | 'lg'
  cap?: 'round' | 'square'
  barColor?: string
}

// Max height is 24px due to card border radius
const ProgressBar: React.FC<IProgressBar> = ({
  value,
  max,
  border="solid",
  color="white",
  rounded,
  size='md',
  cap='round',
  barColor,
  ...props
}) => {
  return <Card 
    className={`${styles.ProgressBar} ${styles[size]}`}
    fill
    type={"transparent"}
    border={border}
    color={color}
    {...props}
    rounded={rounded}
  >
    <motion.div
      className={`${styles.barContainer} ${styles[color]} ${styles[cap]}`}
      style={{width: `${value / max * 100}%`,
      background: barColor ? barColor : ''
    }} 
    >
      <motion.div 
        className={`${styles.bar} ${styles[size]} ${styles[color]}`} 
        style={barColor ? {background: barColor } : {}}
      />
    </motion.div>
  </Card>
}

export default ProgressBar