import { useRef } from "react";
import { useClickOutside } from "~/util/hooks/useClickOutside";
import { LinkButton } from "~/components/Button";
import styles from "./NavBarModal.module.scss";
import { motion } from "framer-motion";

interface INavBarModal {
  handleModal: (_: boolean) => void;
  navLinks: ILinkButton[];
}

interface ILinkButton {
  children: string;
  size: "small" | "medium" | "large";
  type: "internal" | "external";
  handleClick: () => void;
}

const NavBarModal = ({ handleModal, navLinks }: INavBarModal) => {
  // if page is alredy on resources href id only otherwise switch page and then id
  const navBarModal = useRef(null);

  useClickOutside(navBarModal, () => handleModal(false));

  return (
    <motion.div
      ref={navBarModal}
      className={styles.container}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{ x: 'calc(50vw - 40%)' }}
    >
      {navLinks.map((link) => (
        <h4>
          <a
            onClick={() => handleModal(false)}
            href={`/resources#${link.children}`}
          >
            <LinkButton
              size={link.size}
              type={link.type}
              handleClick={() => { }}
            >
              {link.children}
            </LinkButton>
          </a>
        </h4>
      ))}
      <div className={styles.socials}>
        <a href="https://x.com/fluiditylabs">
          <img src="/assets/images/socials/twitter.svg" />
        </a>
        <a href="https://discord.gg/CNvpJk4HpC">
          <img src="/assets/images/socials/discord.svg" />
        </a>
        <a href="https://t.me/fluiditymoney">
          <img src="/assets/images/socials/telegram.svg" />
        </a>
        <a href="https://www.linkedin.com/company/74689228/">
          <img src="/assets/images/socials/linkedin.svg" />
        </a>
      </div>
    </motion.div>
  );
};

export default NavBarModal;
