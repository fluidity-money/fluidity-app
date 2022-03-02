import { useState, useContext, useEffect } from "react";
import Header from "components/Header";
import Button from "components/Button";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import Input from "components/Input";
import TokenSelect from "components/Pages/Contents/SwapPage/TokenSelect";
import { useSigner } from "util/hooks";
import {
  modalToggle,
  SwapModalStatus,
  userActionContext,
} from "components/context";
import makeContractSwap from "util/makeContractSwap";
import ConfirmPaymentModal from "components/Modal/Themes/ConfirmPaymentModal";
import { extOptions, intOptions } from "components/Token/TokenTypes";
import { TokenKind } from "components/types";
import { useWallet } from "use-wallet";
import { JsonRpcProvider, TransactionReceipt } from "ethers/providers";
import { ConnectWalletModal } from "components/Modal";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import { getBalanceOfERC20 } from "util/contractUtils";
import contractList, {
  SupportedFluidContracts,
  SupportedContracts,
} from "util/contractList";
import { notificationContext } from "components/Notifications/notificationContext";
import { parseUnits } from "ethers/utils";
import { decimalTrim } from "util/decimalTrim";
import { isNonZero, shortBalance, trimAmount } from "util/amounts";

const SwapBox = () => {
  const signer = useSigner();
  const [amount, setAmount] = useState<string>("0.0"); // Records From amount
  const [swap, setSwap] = useState<boolean>(true); // toggles between swap to and from Fluid dollars
  const [paymentModalToggle, setPaymentModalToggle] = useState<boolean>(false); // toggle state for payment modal
  const [walletSelectionModal, setWalletSelectionModal] =
    useState<boolean>(false); // toggle state for wallet selection modal
  const [successTransactionModal, setSuccessTransactionModal] =
    useState<boolean>(false); // toggle state for the transaction confirmation
  const [balance, setBalance] = useState<string>("0"); // state to track status of selected fluid amount in wallet
  const [fbalance, setfBalance] = useState<string>("0"); // state to track amount of selected standard token in wallet

  const wallet = useWallet<JsonRpcProvider>();
  const { status: walletStatus } = useWallet<JsonRpcProvider>();

  const { addError, addStaticNotification } = useContext(notificationContext);

  // userActions context to update balance when potentially sending/receiving
  const userActions = useContext(userActionContext);

  // catches user amount input to ensure it's valid
  const amountValueChanger = (input: string) => {
    try {
      if (!input) {
        setAmount(decimalTrim(input, decimals + 1));
        return;
      }
      parseUnits(input.toString(), decimals);
      setAmount(input);
    } catch (e) {
      return;
    }
    setAmount(input);
  };

  const setMaxAmount = () => {
    swap ? setAmount(balance) : setAmount(fbalance);
  };

  // Modal toggle context definition
  const [toggleTo, setToggleTo] = useState<boolean>(false);

  const [toggleFrom, setToggleFrom] = useState<boolean>(false);

  const [selectedToken, setSelectedToken] =
    useState<TokenKind["type"]>("Select Token");

  const [selectedFluidToken, setSelectedFluidToken] =
    useState<TokenKind["type"]>("Select FLUID");

  const [decimals, setDecimals] = useState(0); // number of decimal places for current token

  useEffect(() => {
    if (selectedToken === "Select Token" || selectedToken === "Select FLUID")
      return;

    const { decimals } = contractList["ETH"]?.[selectedToken] || {};
    if (decimals) setDecimals(decimals);
  }, [selectedToken]);

  // Toggle payment modal
  const switchPayment = () => {
    setPaymentModalToggle(!paymentModalToggle);
  };

  // Toggle wallet select modal
  const switchWallet = () => {
    setWalletSelectionModal(!walletSelectionModal);
  };

  // Toggles from and to trade box
  const switchSwap = () => {
    setSwap(!swap);
  };

  const togglerTo = () => {
    setToggleTo(!toggleTo);
    return;
  };

  const togglerFrom = () => {
    setToggleFrom(!toggleFrom);
    return;
  };

  const setterToken = (input: TokenKind["type"], index: number) => {
    // update decimals
    if (input !== "Select Token" && input !== "Select FLUID") {
      const { decimals } = contractList["ETH"]?.[input] || {};
      if (decimals) {
        setAmount(trimAmount(amount, decimals));
        setDecimals(decimals);
      }
    }

    // update tokens
    setSelectedToken(input);
    setSelectedFluidToken(intOptions[index].type);
    return;
  };

  const setterFluidToken = (input: TokenKind["type"], index: number) => {
    // update decimals
    if (input !== "Select Token" && input !== "Select FLUID") {
      const { decimals } = contractList["ETH"]?.[input] || {};
      if (decimals) {
        setAmount(trimAmount(amount, decimals));
        setDecimals(decimals);
      }
    }

    // update tokens
    setSelectedFluidToken(input);
    setSelectedToken(extOptions[index].type);
    return;
  };

  const modalContext: SwapModalStatus = {
    toggleTo: [toggleTo, togglerTo],
    toggleFrom: [toggleFrom, togglerFrom],
    selectedToken: [selectedToken, setterToken],
    selectedFluidToken: [selectedFluidToken, setterFluidToken],
  };

  // Function to trigger transaction on confirm
  const initialiseTransaction = async () => {
    let removeNotification: Function = () => 0;
    try {
      removeNotification = addStaticNotification("Transaction pending...");
      switchPayment();

      const swapResult: TransactionReceipt | undefined = await makeContractSwap(
        swap ? "toFluid" : "fromFluid",
        amount,
        selectedToken as SupportedContracts,
        signer,
        addError
      );

      if (swapResult?.status === 1) setSuccessTransactionModal(true);
    } catch (e) {
      console.log(e);
    } finally {
      removeNotification();
    }
  };

  useEffect(() => {
    // Balance of Fluid
    signer &&
      getBalanceOfERC20(
        selectedFluidToken as SupportedFluidContracts,
        signer,
        decimals
      ).then((r) => setfBalance(r));
    // Balance of Standard
    signer &&
      getBalanceOfERC20(
        selectedToken as SupportedContracts,
        signer,
        decimals
      ).then((r) => setBalance(r));
  }, [
    selectedToken,
    selectedFluidToken,
    walletStatus,
    signer,
    userActions.length,
  ]);

  // reset input to selected token's max when switching
  useEffect(() => {
    const currentBalance = swap ? balance : fbalance;
    if (!amount || !currentBalance || !decimals) return;

    if (
      parseUnits(amount || "0", decimals).gt(
        parseUnits(currentBalance, decimals)
      )
    )
      setAmount(currentBalance);
  }, [swap]);

  const AmountAvailable = ({ invert = false }: { invert?: boolean }) => {
    let isNonFluid = swap;
    if (invert) isNonFluid = !isNonFluid;

    return (
      <div className='amount-avail secondary-text'>
        {walletStatus === "connected" ? (
          isNonFluid ? (
            selectedToken !== "Select Token" ? (
              `Balance: ${shortBalance(balance)} ${selectedToken}`
            ) : null
          ) : selectedFluidToken !== "Select FLUID" ? (
            `Balance: ${shortBalance(fbalance)} ${selectedFluidToken}`
          ) : null
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <modalToggle.Provider value={modalContext}>
      <div className='swap-box-container flex column'>
        <div className='swap-form flex column flex-space-between'>
          <FormSection
            defaultMargin={false}
            cname='flex row flex-space-between swap-box-header'
          >
            <Header type='left primary' size='medium'>
              Convert
            </Header>
          </FormSection>
          <FormSection cname='swap-field'>
            <div className='flex column'>
              <Header type='swap-box-subheader left primary' size='medium'>
                From
              </Header>
              <div className='flex flex-space-between'>
                <Input
                  type='text'
                  theme='input-swap-box'
                  toggle={true}
                  output={amountValueChanger}
                  value={amount}
                  pholder='0.0'
                  disabled={
                    selectedToken === "Select Token" &&
                    selectedFluidToken === "Select FLUID"
                  }
                />
              </div>
            </div>
            <div className='swap-field-right'>
              <TokenSelect
                type={swap === true ? "token" : "fluid"}
                toggle={swap === true ? togglerTo : togglerFrom}
              />
              <div
                onClick={setMaxAmount}
                className='flex row balance-container'
              >
                {(selectedToken !== "Select Token" ||
                  selectedFluidToken !== "Select FLUID") &&
                  walletStatus === "connected" && (
                    <>
                      <AmountAvailable />
                      <Button
                        theme={"max-button"}
                        goto={setMaxAmount}
                        label='max'
                      />
                    </>
                  )}
              </div>
            </div>
          </FormSection>
          <FormSection cname='flex flex-center'>
            <Icon src='i-swap-arrow' trigger={switchSwap} />
          </FormSection>
          <FormSection cname='swap-field'>
            <div className='flex column'>
              <Header type='swap-box-subheader left primary' size='medium'>
                To
              </Header>
              <div className='flex flex-space-between'>
                <Input
                  type='text'
                  theme='input-swap-box'
                  toggle={true}
                  output={() => {}}
                  value={amount}
                  pholder='0.0'
                  disabled={true}
                />
              </div>
            </div>
            <div className='swap-field-right'>
              <TokenSelect
                type={swap === true ? "fluid" : "token"}
                toggle={swap === true ? togglerFrom : togglerTo}
              />
              {wallet.status === "connected" && <AmountAvailable invert />}
            </div>
          </FormSection>
          <FormSection>
            <Button
              className='raleway'
              label={`${
                wallet.status == "connected"
                  ? swap
                    ? "Fluidify your money"
                    : "Revert your fluid"
                  : "Connect to Wallet"
              }`}
              goto={() => {
                wallet.status == "connected" ? switchPayment() : switchWallet();
              }}
              theme={"primary-button"}
              padding='py-1'
              disabled={
                (isNonZero(amount, decimals) &&
                  selectedToken !== "Select Token" &&
                  selectedFluidToken !== "Select FLUID") ||
                wallet.status != "connected"
                  ? false
                  : true
              }
            />
            {/* For Connecting to a Wallet */}
            <ConnectWalletModal
              enable={walletSelectionModal}
              toggle={() => switchWallet()}
              height='auto'
              width='22.5rem'
            />
            {/* For Transaction Confirmation */}
            <ConfirmPaymentModal
              type={swap === true ? "token" : "fluid"}
              amount={amount}
              enable={paymentModalToggle}
              toggle={switchPayment}
              confirmTrigger={initialiseTransaction}
            />
            {/* For when a transaction is successful */}
            <TransactionConfirmationModal
              enable={successTransactionModal}
              toggle={() => setSuccessTransactionModal(false)}
              message={
                <div className='primary-text'>Transaction Successful</div>
              }
            />
          </FormSection>
        </div>
      </div>
    </modalToggle.Provider>
  );
};

export default SwapBox;
