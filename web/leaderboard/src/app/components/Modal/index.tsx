import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { Text } from "@fluidity-money/surfing";

import styles from "./Modal.module.scss";

interface IModal {
  isOpen: boolean;
  close: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, close, title, children }: IModal) => {
  const [modal, setModal] = useState<React.ReactPortal | null>(null);

  const closeWithEsc = useCallback(
    (event: { key: string }) => {
      event.key === "Escape" && isOpen === true && close();
    },
    [isOpen, close]
  );

  useEffect(() => {
    document.addEventListener("keydown", closeWithEsc);
    return () => document.removeEventListener("keydown", closeWithEsc);
  }, [isOpen, closeWithEsc]);

  useEffect(() => {
    isOpen
      ? setModal(
          createPortal(
            <div
              className={`${styles["connect-wallet-outer-container"]}
          `}
            >
              <div
                onClick={close}
                className={styles["connected-wallet-background"]}
              ></div>
              <div className={`${styles["connect-wallet-modal-container"]}`}>
                <div className={styles["connect-wallet-modal-header"]}>
                  <Text>{title}</Text>
                  <Image
                    onClick={close}
                    src="/x.svg"
                    className={styles["modal-cancel-btn"]}
                    width={32}
                    height={32}
                    alt="Close"
                  />
                </div>
                <div>{children}</div>
                <footer>
                  <Text size="xs" className={styles.legal}>
                    By connecting a wallet, you agree to Fluidity Money&apos;s{" "}
                    <a
                      className={styles.link}
                      href="https://static.fluidity.money/assets/fluidity-website-tc.pdf"
                    >
                      Terms of Service
                    </a>{" "}
                    and acknowledge that you have read and understand the{" "}
                    <a className={styles.link}>Disclaimer</a>
                  </Text>
                </footer>
              </div>
            </div>,
            document.body
          )
        )
      : setModal(null);
  }, [isOpen, close, title, children]);

  return modal;
};

export default Modal;
