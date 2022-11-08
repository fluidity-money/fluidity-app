import type { ReactNode } from "react-dom";

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

type IModal = {
  visible: boolean;
  children: React.ReactNode;
};

const Modal = ({ visible, children }: IModal) => {
  const [modalElement, setModalElement] = useState<HTMLElement>();

  useEffect(() => {
    const modalRoot = document.body;
    const el = document.createElement("div");

    el.id = "wallet-modal";

    modalRoot.appendChild(el);
    setModalElement(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  return <>{modalElement && visible && createPortal(children, modalElement)}</>;
};

export default Modal;
