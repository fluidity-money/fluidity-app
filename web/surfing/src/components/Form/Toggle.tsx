import { useState } from "react";
import styles from './Toggle.module.scss'
import { AnimationProps, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "~/components";

interface IToggle extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  direction?: 'horizontal' | 'vertical';
  color?: 'white' | 'black';
  onClick?: () => void
}

// Supports both controlled and uncontrolled behaviour
export const Toggle: React.FC<IToggle> = ({
  checked: controlledChecked = undefined,
  defaultChecked = undefined,
  direction = 'horizontal',
  color = 'white',
  onClick = undefined,
  ...props
}) => {
  const controlled = controlledChecked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked ?? false);

  const checked = controlled ? controlledChecked : uncontrolledChecked;
  const vertical = direction === 'vertical';

  const classNames = `
    ${styles.Toggle}
    ${styles[direction]}
    ${styles[color]}
  `

  return (
    <motion.div className={classNames} onClick={
      () => {
        if (controlled) {
          onClick?.();
        } else {
          setUncontrolledChecked(curr => !curr);
        }
      }
    }>
      <input
        type="checkbox"
        className={styles.input}
        {...props}
        checked={checked}
      />
      <motion.div className={styles.thumb}
        animate={{
          x: checked ? (vertical ? 0 : '15px') : (vertical ? 0 : 0),
          y: checked ? (vertical ? '15px' : 0) : (vertical ? 0 : 0),
        }
        }
      >
        <ArrowPath
          animate={{
            rotateX: vertical ? (checked ? 0 : 180) : 0,
            rotateZ: vertical ? 0 : 90,
            rotateY: vertical ? 0 : (checked ? 180 : 0),
          }}
        />
      </motion.div>
    </motion.div>
  )
}

const ArrowPath = ({ animate }: AnimationProps) => {
  return <motion.svg animate={animate} width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 0.5L5 11.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 4.5L5 0.5L1 4.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  </motion.svg>
}  
  