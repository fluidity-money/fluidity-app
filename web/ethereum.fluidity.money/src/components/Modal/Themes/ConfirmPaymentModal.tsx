import GenericModal from "../GenericModal";
import Button from "components/Button";
import Header from "components/Header";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import Token from "components/Token";
import { intOptions, extOptions } from "components/Token/TokenTypes";
import { modalToggle } from "components/context";
import { useContext } from "react";
import { TokenKind, Token as TokenType } from "components/types";
import { SupportedContracts } from "util/contractList";

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
  const defaultVar: TokenKind = {
    type: "" as TokenType,
    src: "",
    colour: ""
  };

  // From token
  let From = defaultVar;
  type === "token"
    ? extOptions.map((option) => {
      if (option.type === selectedToken[0]) {
        From = option;
      }
      return {};
    })
    : intOptions.map((option) => {
      if (option.type === selectedFluidToken[0]) {
        From = option;
      }
      return {};
    });

  // To
  let To = defaultVar;
  type === "token"
    ? intOptions.map((option) => {
      if (option.type === selectedFluidToken[0]) {
        //  Token info found and returned
        To = option;
      }
      return {};
    })
    : extOptions.map((option) => {
      if (option.type === selectedToken[0]) {
        //  Token info found and returned
        To = option;
      }
      return {};
    });

  // Abbreviation of long string with "..."
  const stringAbbreviation = (value: string, limit: number) => {
    if (value.length >= limit) {
      return value.substr(0, limit) + "...";
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
            <Token token={From} cname="payment-token" /> {stringAbbreviation(amount, 15)}
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
            <Token token={To} cname="payment-token" /> {stringAbbreviation(amount.toString(), 15)}
          </div>
        </FormSection>
        <FormSection cname="payment-modal-form">
          <div className="payment-text flex flex-space-between">
            <div>Swap:</div>
            <div>
              {stringAbbreviation(amount.toString(), 6) + " " + From.type + " = " + stringAbbreviation(amount.toString(), 6) + " " + To.type}
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
