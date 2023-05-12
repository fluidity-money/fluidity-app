import { motion, useDragControls, useMotionValue } from 'framer-motion'
import styles from './Slider.module.scss'
import React, { PointerEvent, useEffect, useLayoutEffect } from 'react'
// min={31}
// value={stakingDuration}
// max={365}
// step="1"
export interface ISlider {
  min: number
  max: number
  step: number
  valueCallback: (value: number) => void
}

export const Slider: React.FC<ISlider> = ({
  min,
  max,
  step,
  valueCallback
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const dragControls = useDragControls()

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    dragControls.start(event, { snapToCursor: false })
    const rounded = (x.get() / stepWidth) * stepWidth
    x.set(rounded)
  }

  const [dragX, setDragX] = React.useState(0)
  // const [value, setValue] = React.useState(0)
  const [containerWidth, setContainerWidth] = React.useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef?.current) return
      console.log('window', window.innerWidth)
      console.log('track', trackRef.current.clientWidth)
      setContainerWidth(trackRef.current.clientWidth)
    }

    measure()

    window.addEventListener("resize", measure );

         return () => {
           window.removeEventListener("resize",measure );
         };
  }, [])

  const range = max - min;
  const steps = range / step;
  const stepWidth = containerWidth / steps;

  useEffect(() => x.onChange(latest => {setDragX(latest)}), [x])
  useEffect(() => { 
    if (containerWidth === 0) {
      valueCallback(min)
      return
    }
    const value = min + Math.round(dragX / stepWidth) * step
    if (value > max) {
      valueCallback(max)
      return
    }
    if (value < min) {
      valueCallback(min)
      return
    }
    valueCallback(value)
  }, [dragX] )

  return (
    <>
      {/* Debug */}
      {/* <span style={{color: 'white'}}>

        Drag X: {dragX} <br />
        Container width: {containerWidth} <br />
        Range: {range} <br />
        Steps: {steps} <br />
        Step Width: {stepWidth} <br />
      </span> */}
    <motion.div 
      className={styles.Slider}    
      onPointerDown={startDrag}
      ref={containerRef}
    >
      <motion.div
        className={styles.track}
        ref={trackRef}
      />
      <motion.div 
        drag="x" 
        style={{x}}
        dragControls={dragControls}
        className={styles.thumb}
        whileDrag={{ scale: 1.2 }}
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDrag={(_, info) => {
          const rounded = (x.get() / stepWidth) * stepWidth
          x.set(rounded)
        }}
      />
    </motion.div>
    </>
  )
}