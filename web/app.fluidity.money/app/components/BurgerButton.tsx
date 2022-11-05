import { motion } from "framer-motion";
import { GeneralButton } from "@fluidity-money/surfing";

interface IBurgerMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BurgerMenu = ({ isOpen, setIsOpen }: IBurgerMenuProps) => {
  const diagonalVariants = {
    rotateD: { rotate: 45, y: 4 },
    rotateU: { rotate: -45, y: -4 },
    stop: { rotate: 0 },
  };

  const disappearingVariants = {
    appear: { opacity: 1 },
    disappear: { opacity: 0 },
  };

  return (
    <GeneralButton
      version="transparent"
      size="small"
      buttontype="text"
      handleClick={() => setIsOpen(!isOpen)}
      className={"burger-btn"}
    >
      <motion.span
        variants={diagonalVariants}
        className={"burger-span"}
        animate={isOpen ? "rotateD" : "stop"}
      ></motion.span>
      <motion.span
        variants={disappearingVariants}
        className={"burger-span"}
        animate={isOpen ? "disappear" : "appear"}
      ></motion.span>
      <motion.span
        variants={diagonalVariants}
        className={"burger-span"}
        animate={isOpen ? "rotateU" : "stop"}
      ></motion.span>
    </GeneralButton>
  );
};

export default BurgerMenu;
