import { FunctionComponent } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  enable: boolean
  toggle: Function
  height?: string
  width?: string
  children?: JSX.Element | JSX.Element[]
}

const GenericModal: FunctionComponent<ModalProps> = ({
  enable,
  toggle,
  children,
  height,
  width,
}: ModalProps) => {

  return enable ? (
    ReactDOM.createPortal(
      <div className="modal-container" onClick={() => toggle()}>
        <div
          className="modal-body"
          style={{ height: height, width: width }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>,
      document.querySelector("#modal-generic")!
    )
  ) : <></>
};

export default GenericModal;
