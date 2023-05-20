import { AnimatePresence, motion, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { ReactElement, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Card, Text } from "~/components";
import { ICard } from "../Card/Card";

import styles from "./HeroCarousel.module.scss";

const swipeConfidenceThreshold = 1;

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

interface IHeroCarousel extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactElement<ICard>[];
  title: string;
  onSlideChange?: (i: number) => void;
  controlledIndex?: number;
}

/**
 * Takes a set of Cards and displays them in a large Carousel.
 * @param children *Must* be an array of `Card`'s with length greater than 1
 */
const HeroCarousel: React.FC<IHeroCarousel> = ({
  children,
  title,
  onSlideChange,
  controlledIndex = 0,
  ...props
}) => {
  const slides = children.length;
  if (slides < 2) return null;

  const [[slide, direction], setSlide] = useState([controlledIndex, 0]);

  const paginate = (dir: number) => {
    setSlide(([slide, direction]) => [
      slide + dir < slides && slide + dir >= 0 ? slide + dir : slide,
      dir,
    ]);
  };

  // This block calcs the diff between the new index and the curr and paginates until they match
  useEffect(() => {
    const diff = controlledIndex - slide;
    if (diff === 0) return
    const dir = diff > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(diff); i++) {
      paginate(dir);
    }
  }, [controlledIndex])

  const prevSlideIndex = slide - 1;
  const nextSlideIndex = slide + 1;

  const controls = useDragControls();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  useEffect(() => {
    if (onSlideChange) onSlideChange(slide)
  }, [slide])

  return (
    <div {...props} className={styles.HeroCarousel}>
      <div className={styles.nav}>
        <motion.div
          animate={{
            opacity: prevSlideIndex >= 0 ? 1 : 0.3,
          }}
          style={{ cursor: prevSlideIndex >= 0 ? "pointer" : "default" }}
          onClick={() => paginate(-1)}
        >
          <ArrowLeft />
        </motion.div>
        <Text prominent>{title}</Text>
        <motion.div
          style={{
            rotate: 180,
            cursor: nextSlideIndex < slides ? "pointer" : "default",
          }}
          animate={{
            opacity: nextSlideIndex < slides ? 1 : 0.3,
          }}
          onClick={() => paginate(1)}
        >
          <ArrowLeft />
        </motion.div>
      </div>
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
        animate={{
          left: `calc(-${slide} * 60%)`,
          transition: {
            type: "easeOut",
            duration: 0.3,
          },
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          {children.map((child, index) => {
            const isActive = index === slide;
            const isLeft = index < slide;
            const distance = isLeft ? slide - index : index - slide;
            return (
              <motion.div
                className={`${styles.slide} ${isActive ? styles.active : ""}`}
                key={index}
                // onMouseDown={e=> controls.start(e)}
                style={{
                  gridColumn: `${index * 3 + 1} / span 5 `,
                }}
                animate={{
                  top: isActive ? 0 : isLeft ? -100 * distance : 100 * distance,
                  rotateZ: isActive ? 0 : isLeft ? -8 * distance : 8 * distance,
                  opacity: isActive
                    ? 1
                    : (1 / Math.pow(distance * 3, 2)).toFixed(2),
                  transition: {
                    duration: 0.4,
                    ease: "easeOut",
                  },
                }}
              >
                <Card
                  {...child.props}
                  shimmer={isActive}
                  className={styles.card}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default HeroCarousel;
