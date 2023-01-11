import { motion, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion';
import { wrap } from '@motionone/utils';
import { ReactNode } from 'react';
import styles from "./MotionContinuousCarousel.module.scss";

interface IMCC {
  children: ReactNode;
  baseVelocity?: number;
  
}

 export const MotionContinuousCarousel = ({ children, baseVelocity = 1 }: IMCC) => {
  /**
   * Will create a continuous carousel in 1 of 2 directions based on children
   * This is a wrapping for the length of the text
   * baseVlocity with a positiove integer (1) is left-to-right
   * baseVlocity with a negative integer (-1) is right-to-left
   * baseVelocity determines the speed the carousel will move (higher number, faster the speed)
   * The x motion value is derived from the list size dynamically
   */

  const baseX = useMotionValue(0);
  const min = -20
  const max = -45
  const x = useTransform(baseX, (v) => `${wrap(min, max, v)}%`);

  const callback = (_time: number, delta:number) => {
    let moveBy = baseVelocity * (delta / 5000);
    moveBy += moveBy;
    baseX.set(baseX.get() + moveBy);
  }

  useAnimationFrame(callback as any);

  return (
    <section>
      <div className={styles.parallax}>
        <motion.div
          className={styles.scroller}
          style={{
            x,
          }}
        >
          <span>{children}</span>
          <span>{children}</span>
        </motion.div>
      </div>
    </section>
  );
};

export default MotionContinuousCarousel;