import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CaretLeft, CaretRight, Text } from '~/components/';
import { ICard } from '../Card/Card';

import styles from './CardCarousel.module.scss'

interface ICardCarousel extends Partial<ICard> {
  children: React.ReactNode[];
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    };
  }
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const CardCarousel: React.FC<ICardCarousel> = ({
  children,
  ...props
}) => {

  const slides = children.length

  const [[slide, direction], setSlide] = useState([0, 0])

  const paginate = (dir: number) => {
    setSlide(([slide, direction]) => [(slide+dir < slides && slide+dir >= 0) ? slide + dir : dir === 1 ? 0 : slides-1, dir]);
  };

  if (slides < 2) return null

  return (
    <Card {...props} type="box" rounded className={styles.CardCarousel}>
      <div className={styles.content}>
        <AnimatePresence
          initial={false}
          custom={direction}
        >
          <motion.div 
            className={styles.slide}
            key={`card-carousel-${slide}`} 
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
  
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            { children[slide] }
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={styles.arrow} onClick={() => {
        paginate(-1)
      }}>
        <CaretLeft />
      </div>
      <div className={styles.navbar}>
        {children.map((_, i) => (
          <div 
            key={i} 
            className={`${slide === i ? styles.active : ''} ${styles.dot}`} 
            onClick={() => {
              setSlide([i, i > slide ? 1 : -1])
            }}
          />
        ))}
      </div>
      <div className={styles.arrow} onClick={() => {
        paginate(1)
      }}>
        <CaretRight />
      </div>
    </Card>
  );
};

export default CardCarousel;