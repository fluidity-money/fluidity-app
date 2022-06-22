import GenericModal from "../GenericModal";
import Button from "components/Button";
import Header from "components/Header";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import Token from "components/Token";
import ropsten from "../../../config/ropsten-tokens.json";
import testing from "../../../config/testing-tokens.json";
import kovan from "../../../config/kovan-tokens.json";
import aurora from "../../../config/aurora-mainnet-tokens.json";
import mainnet from "../../../config/mainnet-tokens.json";
import { modalToggle } from "components/context";
import { useContext } from "react";
import { TokenKind, Token as TokenType } from "components/types";
import { SupportedContracts } from "util/contractList";
import ChainId, { chainIdFromEnv } from "util/chainId";
import { appTheme } from "util/appTheme";

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
    symbol: "" as TokenType,
    name: "",
    image: "",
    colour: "",
    address: "",
    decimals: 0,
    amount: "",
    pinned: false,
  };

  // Assigns the correct json file based on ChainId
  const chainId = chainIdFromEnv();
  const data =
    chainId === ChainId.Ropsten
      ? (ropsten as TokenKind[])
      : chainId === ChainId.Hardhat
      ? (testing as TokenKind[])
      : chainId === ChainId.Kovan
      ? (kovan as TokenKind[])
      : chainId === ChainId.AuroraMainnet
      ? (aurora as TokenKind[])
      : chainId === ChainId.Mainnet
      ? (mainnet as TokenKind[])
      : (ropsten as TokenKind[]);

  const ext = data.slice(0, data.length / 2);
  const int = data.slice(data.length / 2, data.length);

  // From token
  let From = defaultVar;
  type === "token"
    ? ext.map((option) => {
        if (option.symbol === selectedToken[0]) {
          From = option;
        }
        return {};
      })
    : int.map((option) => {
        if (option.symbol === selectedFluidToken[0]) {
          From = option;
        }
        return {};
      });

  // To
  let To = defaultVar;
  type === "token"
    ? int.map((option) => {
        if (option.symbol === selectedFluidToken[0]) {
          //  Token info found and returned
          To = option;
        }
        return {};
      })
    : ext.map((option) => {
        if (option.symbol === selectedToken[0]) {
          //  Token info found and returned
          To = option;
        }
        return {};
      });

  // Abbreviation of long string with "..."
  const stringAbbreviation = (value: string, limit: number) => {
    if (value.length >= limit) {
      return value.substr(0, limit) + "...";
    }
    return value;
  };

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
            <Token token={From} cname="payment-token" />{" "}
            {stringAbbreviation(amount, 15)}
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
            <Token token={To} cname="payment-token" />{" "}
            {stringAbbreviation(amount.toString(), 15)}
          </div>
        </FormSection>
        <FormSection cname="payment-modal-form">
          <div className="payment-text flex flex-space-between">
            <div>Swap:</div>
            <div>
              {stringAbbreviation(amount.toString(), 6) +
                " " +
                From.symbol +
                " = " +
                stringAbbreviation(amount.toString(), 6) +
                " " +
                To.symbol}
            </div>
          </div>
        </FormSection>
        <Button
          label="Confirm"
          goto={confirmTrigger}
          theme={`payment-button primary-button${appTheme}`}
        />
      </div>
    </GenericModal>
  );
};

export default ConfirmPaymentModal;
