import styles from './Group.module.scss'
import Text from '../../Text/Text'
import { useState } from 'react'

export interface IGroup {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  label?: string
  hint?: string
}

export const Group: React.FC<IGroup> = ({
  className = "",
  style = {},
  ...props
}) => {
  const [focus, setFocus] = useState(false)
  return (
    <div
      style={style}
      className={`${styles.Group} ${className} ${focus ? styles.focus : ""}`}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    >
      <Text>{props.label}</Text>
      <div className={styles.inputRow}>
        {props.children}
      </div>
      <Text>{props.hint}</Text>
    </div>
  )
}
