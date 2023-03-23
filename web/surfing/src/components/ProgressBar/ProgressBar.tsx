import { motion } from 'framer-motion'
import Card, { ICard } from '../Container/Card/Card'
import styles from './ProgressBar.module.scss'

interface IProgressBar extends ICard {
  value: number
  max: number
  type?: 'box-prominent' | 'box' | 'holobox' | 'transparent' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  cap?: 'round' | 'square'
  barColor?: string
}

// Max height is 24px due to card border radius
const ProgressBar: React.FC<IProgressBar> = ({
  value,
  max,
  type='box-prominent',
  props,
  rounded,
  size='md',
  cap='round',
  barColor
}) => {
  return <Card 
    className={`${styles.ProgressBar} ${styles[size]}`}
    fill
    type={type}
    {...props}
    rounded={rounded}
  >
    <motion.div
      className={`${styles.barContainer} ${styles[type]} ${styles[cap]}`}
      style={{width: `${value / max * 100}%`,
      background: barColor ? barColor : ''
    }} 
    >
      <motion.div 
        className={`${styles.bar} ${styles[size]} ${styles[type]}`} 
        style={barColor ? {background: barColor } : {}}
      />
    </motion.div>
  </Card>
}

export default ProgressBar