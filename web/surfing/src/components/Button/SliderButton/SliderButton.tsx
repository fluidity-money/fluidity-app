import { motion, useDragControls, useMotionValue } from 'framer-motion'
import styles from './SliderButton.module.scss'
import { ArrowRight } from '~/lib'
import { useEffect, useRef, useState } from 'react'

interface ISliderButton {
  onSlideComplete: () => void
  children: React.ReactNode
  disabled?: boolean
}

export const SliderButton: React.FC<ISliderButton> = ({
  children,
  onSlideComplete,
  disabled = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const dragControls = useDragControls()

  const [dragComplete, setDragComplete] = useState(false)
  const [width, setWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!containerRef.current) return
    setWidth(containerRef.current.offsetWidth)
  }, [containerRef])

  return (
    <motion.div className={styles.SliderButton} ref={containerRef} style={dragComplete ? { background: 'white' } : {}}>
      <motion.div
        className={styles.draggable}
        drag="x"
        dragElastic={0}
        dragSnapToOrigin
        dragMomentum={false}
        dragConstraints={
          containerRef
        }
        onDragEnd={(event, info) => {
          if (!width) return
          if (info.offset.x >= width) {
            setDragComplete(true)
            onSlideComplete()
          }
        }}
        style={{ cursor: 'grab' }}
      >
        <div
          className={styles.track}

        />
        <div className={styles.thumb}>
          <ArrowRight />
        </div>
      </motion.div>
      <motion.div className={styles.content}>
        {children}
      </motion.div>
    </motion.div>
  )
}
