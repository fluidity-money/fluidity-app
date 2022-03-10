import Button from "components/Button";
import GenericModal from "components/Modal/GenericModal";

const TransactionConfirmationModal = ({enable, toggle, message}: {enable: boolean; toggle: () => void; message: JSX.Element | JSX.Element[];}) => {

    return (
        <GenericModal
            enable={enable}
            toggle={toggle}
        >
            <div className="modal-body transaction-confirmation-modal-form">
                {/* Check mark svg*/}
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    {/* Circle gradient colour toggle*/}
                    <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#16899B"></stop>
                        <stop offset="100%" stopColor="#02F5A3"></stop>
                    </linearGradient>
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none">
                    </circle>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h2 className="text-center">{message}</h2>

                <Button theme={"primary-button"} padding="py-1" label={"Dismiss"} goto={toggle}/>
            </div>
        </GenericModal>
    );
};

export default TransactionConfirmationModal;
