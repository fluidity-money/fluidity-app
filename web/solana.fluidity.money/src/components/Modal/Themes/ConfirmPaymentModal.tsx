import GenericModal from "../GenericModal";
import Button from "components/Button";
import Header from "components/Header";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import Token from "components/Token";
import { modalToggle } from "components/context";
import { useContext } from "react";

const ConfirmPaymentModal = ({
  enable,
  toggle,
  confirmTrigger,
  type,
  amount,
}: {
  enable: boolean;
  toggle: () => void;
  confirmTrigger: () => void;
  type: string;
  amount: string;
}) => {
  // Selected token context import
  const selectedToken = useContext(modalToggle).selectedToken;
  const selectedFluidToken = useContext(modalToggle).selectedFluidToken;

  // Functions to work out selected to and from option from context and get the respective external/internal token information

  // From token
  const fromSymbol = type === "token" ? selectedToken[0] : selectedFluidToken[0];
  const toSymbol   = type === "token" ? selectedFluidToken[0] : selectedToken[0];

  // Abbreviation of long string with "..."
  const stringAbbreviation = (value: string, limit: number) => {
    if (value.length >= limit) {
      return value.substring(0, limit) + "...";
    } return value;
  }

  return (
    <GenericModal enable={enable} toggle={toggle} height="auto" width="24rem">
      <div className="payment-modal-body">
        <div className="confirm-modal-header">
          <Header type="left primary" className="confirm-modal-header-text">
            Confirm Swap
          </Header>
          <FormSection cname="payment-modal-x" defaultMargin={false}>
            <Icon src={"modal-close-x"} trigger={toggle} />
          </FormSection>
        </div>
        <FormSection
          cname="swap-field payment-modal-form"
          defaultMargin={false}
        >
          <Header type="swap-box-subheader left primary" size="medium">
            From
          </Header>
          <div className="payment-text flex flex-space-between">
            <Token symbol={fromSymbol} cname="payment-token" /> {stringAbbreviation(amount, 15)}
          </div>
        </FormSection>
        <FormSection cname="payment-arrow" defaultMargin={false}>
          <Icon src="i-swap-arrow" style={{ cursor: "auto" }} />
        </FormSection>
        <FormSection
          cname="swap-field payment-modal-form"
          defaultMargin={false}
        >
          <Header type="swap-box-subheader left primary" size="medium">
            To
          </Header>
          <div className="payment-text flex flex-space-between">
            <Token symbol={toSymbol} cname="payment-token" /> {stringAbbreviation(amount, 15)}
          </div>
        </FormSection>
        <FormSection cname="payment-modal-form">
          <div className="payment-text flex flex-space-between">
            <div>Swap:</div>
            <div>
              {stringAbbreviation(amount, 6) + " " + fromSymbol + " = " + stringAbbreviation(amount, 6) + " " + toSymbol}
            </div>
          </div>
        </FormSection>
        <Button
          label="Confirm"
          goto={confirmTrigger}
          theme={"payment-button primary-button"}
        />
      </div>
    </GenericModal>
  );
};

export default ConfirmPaymentModal;
