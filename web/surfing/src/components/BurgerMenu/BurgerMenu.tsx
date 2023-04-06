import { motion } from "framer-motion";
import styles from "./BurgerMenu.module.scss";
import  GeneralButton  from "../Button/GeneralButton";

interface IBurgerMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BurgerMenu = ({ isOpen, setIsOpen }: IBurgerMenuProps) => {
  const diagonalVariants = {
    rotateD: { rotate: 45, y: 5 },
    rotateU: { rotate: -45, y: -5 },
    stop: { rotate: 0 },
  };

  const disappearingVariants = {
    appear: { opacity: 1 },
    disappear: { opacity: 0 },
  };

  return (
    <GeneralButton 
      type="transparent"
      size="small" 
      className={styles.container} 
      onClick={() => setIsOpen(prev => !prev)}
    >
      <div className={styles.burger}>
        <motion.span
          variants={diagonalVariants}
          className={styles.span}
          animate={isOpen ? "rotateD" : "stop"}
        ></motion.span>
        <motion.span
          variants={disappearingVariants}
          className={styles.span}
          animate={isOpen ? "disappear" : "appear"}
        ></motion.span>
        <motion.span
          variants={diagonalVariants}
          className={styles.span}
          animate={isOpen ? "rotateU" : "stop"}
        ></motion.span>
      </div>
    </GeneralButton>
  );
};

export default BurgerMenu;
