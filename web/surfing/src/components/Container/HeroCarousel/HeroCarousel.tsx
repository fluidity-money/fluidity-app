import { AnimatePresence, motion, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { ReactElement, useState } from "react";
import { Card, Text } from "~/components";
import { ICard } from "../Card/Card";

import styles from "./HeroCarousel.module.scss";

const swipeConfidenceThreshold = 1;

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

interface IHeroCarousel {
  children: ReactElement<ICard>[];
}

/**
 * Takes a set of Cards and displays them in a large Carousel.
 * @param children *Must* be an array of `Card`'s with length greater than 1
 */
const HeroCarousel: React.FC<IHeroCarousel> = ({
  children
}) => {
  const slides = children.length;
  if (slides < 2) return null;

  const [[slide, direction], setSlide] = useState([0, 0]);

  const paginate = (dir: number,) => {
    setSlide(([slide, direction]) => [
      slide + dir < slides && slide + dir >= 0
        ? slide + dir
        : dir === 1
          ? 0
          : slides - 1,
      dir,
    ]);
  };

  const prevSlideIndex = slide - 1;
  const nextSlideIndex = slide + 1;

  const controls = useDragControls()
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0])

  return (
    <div className={styles.HeroCarousel}>
      <Text prominent>BOTTLES I'VE EARNED</Text>
      <motion.div 
        className={styles.deck} 
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (swipe < -swipeConfidenceThreshold) {
            paginate(1);
          } else if (swipe > swipeConfidenceThreshold) {
            paginate(-1);
          }
        }}
        drag="x"
        // dragListener={false}
        animate={
          {
            left: `calc(-${slide} * 60%)`,
            transition: {
              type: "easeInOut",
              duration: 0.3,
            }

          }
        }
      >
        <AnimatePresence initial={false} custom={direction}>
          {children.map((child, index) => {
            const isActive = index === slide;
            const isLeft = index < slide;
            return (
              <motion.div
                className={`${styles.slide} ${isActive ? styles.active : ''}`} 
                key={index}
                // onMouseDown={e=> controls.start(e)}
                style={{
                  gridColumn: `${((index * 3)+1)} / span 5 `,
                  zIndex: isActive ? 1 : 0,
                }}
                animate={{
                  top: isActive ? 0 : (isLeft ? -50 : 50),
                  rotateZ: isActive ? 0 : (isLeft ? -10 : 10),
                  opacity: isActive ? 1 : 0.2,
                  transition: {
                    duration: 0.2,
                  }
                }}
              >
                {child}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HeroCarousel
