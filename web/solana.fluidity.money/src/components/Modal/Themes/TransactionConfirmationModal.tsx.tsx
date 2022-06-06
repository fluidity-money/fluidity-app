import Button from "components/Button";
import { UserActionContext } from "components/context";
import GenericModal from "components/Modal/GenericModal";
import { useContext } from "react";
import { solExplorer } from "util/solana/solExplorer";

const TransactionConfirmationModal = ({
  enable,
  toggle,
  message,
}: {
  enable: boolean;
  toggle: () => void;
  message: React.ReactNode;
}) => {
  const userActions = useContext(UserActionContext);
  return (
    <GenericModal enable={enable} toggle={toggle}>
      <div className="modal-body transaction-confirmation-modal-form">
        {/* Check mark svg*/}
        <svg
          className="checkmark"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          {/* Circle gradient colour toggle*/}
          <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#16899B"></stop>
            <stop offset="100%" stop-color="#02F5A3"></stop>
          </linearGradient>
          <circle
            className="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          ></circle>
          <path
            className="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
        <a
          className="view-on-explorer"
          target="_blank"
          href={
            userActions.length
              ? solExplorer(userActions[0].transaction_hash, "address")
              : "https://explorer.solana.com/?cluster=devnet"
          }
          rel="noreferrer"
        >
          View on Explorer
        </a>
        <h2 className="text-center">{message}</h2>
        <Button
          theme={"primary-button"}
          padding="py-1"
          label={"Dismiss"}
          goto={toggle}
        />
      </div>
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
