
import { motion } from 'framer-motion'
import Card, { ICard } from '../Container/Card/Card'
import styles from './ProgressBar.module.scss'

interface IProgressBar extends ICard {
  value: number
  max: number
  type: 'box-prominent' | 'box' | 'holobox' | 'transparent' | 'gray'
}

const ProgressBar: React.FC<IProgressBar> = ({
  value,
  max,
  type='box-prominent',
  props,
  rounded,
}) => {
  return <Card 
    className={styles.ProgressBar}
    fill
    type={type}
    {...props}
    rounded={rounded}
  >
    <motion.div 
      className={styles.bar} 
      style={{width: `${value / max * 100}%`}} 
    />
  </Card>
}

export default ProgressBar