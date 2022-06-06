import { FunctionComponent } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  enable: boolean;
  toggle: Function;
  height?: string;
  width?: string;
  noBody?: boolean;
  children?: React.ReactNode;
}

const GenericModal: FunctionComponent<ModalProps> = ({
  enable,
  toggle,
  children,
  height,
  width,
  noBody = false,
}: ModalProps) => {
  return enable ? (
    ReactDOM.createPortal(
      <div className="modal-container" onClick={() => toggle()}>
        {noBody ? (
          children
        ) : (
          <div
            className="modal-body"
            style={{ height: height, width: width }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src="/img/x.svg"
              alt="close-button"
              className="clear-icon--modal"
              onClick={() => toggle()}
            />
            {children}
          </div>
        )}
      </div>,
      document.querySelector("#modal-generic")!
    )
  ) : (
    <></>
  );
};

export default GenericModal;
