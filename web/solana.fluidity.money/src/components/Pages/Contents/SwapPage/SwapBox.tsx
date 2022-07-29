import { useState, useContext, useEffect } from "react";
import Header from "components/Header";
import Button from "components/Button";
import Icon from "components/Icon";
import FormSection from "components/Styling/FormSection";
import Input from "components/Input";
import TokenSelect from "components/Pages/Contents/SwapPage/TokenSelect";
import {
  ModalToggle,
  SwapModalStatus,
  LoadingStatusToggle,
  UserActionContext,
} from "components/context";
import ConfirmPaymentModal from "components/Modal/Themes/ConfirmPaymentModal";
import {TokenKind} from "components/types";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import {getBalanceOfSPL} from "util/contractUtils";
import {useSolana} from "@saberhq/use-solana";
import {TokenAmount} from '@saberhq/token-utils';
import useFluidTokens from "util/hooks/useFluidTokens";
import { unwrapSpl, wrapSpl } from "util/solana/transaction";
import { bnToDisplayString, tokenValueInputHandler } from "util/numbers";
import BN from "bn.js";
import {notificationContext} from "components/Notifications/notificationContext";
import {useWalletKit} from "@gokiprotocol/walletkit";

const SwapBox = () => {
  const [amountRaw, setAmountRaw] = useState(""); // Records From amount
  const [amount, setAmount] = useState(""); // Displays from amount (user-friendly)
  const [swap, setSwap] = useState<boolean>(true); // toggles between swap to and from Fluid dollars
  const [paymentModalToggle, setPaymentModalToggle] = useState<boolean>(false); // toggle state for payment modal

  const [successTransactionModal, setSuccessTransactionModal] = useState<boolean>(false); // toggle state for the transaction confirmation
  const [balance, setBalance] = useState("0");  // state to track status of selected fluid amount in wallet
  const [fbalance, setfBalance] = useState("0");  // state to track amount of selected standard token in wallet
  const [previousTransactionHash, setPreviousTransactionHash] = useState(""); 

  const {tokens} = useFluidTokens();
  const sol = useSolana();
  const {connect: connectWallet} = useWalletKit();
  const {addError} = useContext(notificationContext);
  
  // userActions context to update balance when potentially sending/receiving
  const userActions = useContext(UserActionContext);

  // Loading Modal Trigger Function (From App.tsx)
  const loadingToggleTrigger = useContext(LoadingStatusToggle).toggle[1];

  // Transaction confirmation modal toggle function
  const toggleSuccessTransactionModal = () => {
    setSuccessTransactionModal(!successTransactionModal);
  };

  // Modal toggle context definition
  const [toggleTo, setToggleTo] = useState<boolean>(false);
  const [toggleFrom, setToggleFrom] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] =
    useState<TokenKind["symbol"]>("Select Token");
  const [selectedFluidToken, setSelectedFluidToken] =
    useState<TokenKind["symbol"]>("Select FLUID");

  //would be more performant to memoise balances, but this would make it overly complex to update them
  //so instead just fetch every time
  useEffect(() => {
    const fluidToken = tokens?.[selectedFluidToken]?.token;
    const token = tokens?.[selectedToken]?.token;
    if (!fluidToken || !token) return;

    // Balance of Fluid
    fluidToken &&
      sol.publicKey &&
      getBalanceOfSPL(fluidToken, sol.connection, sol.publicKey).then((bal) =>
        setfBalance(bal.amount ?? "0")
      );

    // Balance of Standard
    token &&
      sol.publicKey &&
      getBalanceOfSPL(token, sol.connection, sol.publicKey).then((bal) =>
        setBalance(bal.amount || "0")
      );
  }, [
    selectedToken,
    selectedFluidToken,
    tokens?.[selectedToken],
    successTransactionModal,
    userActions.length,
  ]);

  // reset input to selected token's max when switching
  useEffect(() => {
    if (!tokens) return;

    const currentToken =
      tokens[swap ? selectedToken : selectedFluidToken]?.token;
    const currentBalance = swap ? balance : fbalance;

    // swapping but no token selected
    if (!currentToken) return;

    const tokenAmountRaw = new TokenAmount(currentToken, amountRaw);
    const tokenBalance = new TokenAmount(currentToken, currentBalance);

    if (tokenAmountRaw.greaterThan(tokenBalance)) setMaxBalance();
  }, [swap]);

  // Toggle payment modal
  const switchPayment = () => {
    setPaymentModalToggle(!paymentModalToggle);
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

  const setterToken = (input: TokenKind["symbol"]) => {
    setSelectedToken(input);
    // 'f<token>'
    setSelectedFluidToken(("f" + input) as TokenKind["symbol"]);
    return;
  };

  const setterFluidToken = (input: TokenKind["symbol"]) => {
    setSelectedFluidToken(input);
    // remove 'f'
    setSelectedToken(input.substring(1) as TokenKind["symbol"]);
    return;
  };

  const modalContext: SwapModalStatus = {
    toggleTo: [toggleTo, togglerTo],
    toggleFrom: [toggleFrom, togglerFrom],
    selectedToken: [selectedToken, setterToken],
    selectedFluidToken: [selectedFluidToken, setterFluidToken],
  };

  const setMaxBalance = () => {
    if (!tokens) return;

    const currentToken = swap ? selectedToken : selectedFluidToken;
    if (currentToken === "Select FLUID" || currentToken === "Select Token")
      return;

    const _balance = swap ? balance : fbalance;
    const balanceString = new TokenAmount(
      tokens[currentToken].token,
      _balance
    ).toExact();
    tokenValueInputHandler(
      balanceString,
      setAmount,
      setAmountRaw,
      tokens[currentToken].token
    );
  };

  // Function to trigger transaction on confirm
  const initialiseTransaction = async () => {
    const { token, config } = tokens?.[selectedToken] || {};
    const { token: fluidToken } = tokens?.[selectedFluidToken] || {};
    if (
      !token ||
      !fluidToken ||
      !amountRaw ||
      !config?.obligationPubkey ||
      !config.dataAccountPubkey
    )
      return;

    const checkBalance = new BN(swap ? balance : fbalance);

    if (checkBalance.lt(new BN(amountRaw))) {
      const tokenFrom = swap ? token : fluidToken;
      addError(
        `Trying to swap ${new TokenAmount(tokenFrom, amountRaw).toExact()} ${
          tokenFrom.symbol
        }, but balance is ${bnToDisplayString(tokenFrom, checkBalance)}`
      );
      return;
    }
    try {
      loadingToggleTrigger(true);

      let result: string;
      if (swap) {
        result = await wrapSpl(
          sol,
          fluidToken,
          new TokenAmount(token, amountRaw),
          config.obligationPubkey,
          config.dataAccountPubkey
        );
      } else {
        result = await unwrapSpl(
          sol,
          fluidToken,
          new TokenAmount(token, amountRaw),
          config.obligationPubkey,
          config.dataAccountPubkey
        );
      }

      console.log(result);
      setPreviousTransactionHash(result);

      toggleSuccessTransactionModal();
      switchPayment();
    } catch (e) {
      console.error(e);
      if (
        e?.message ===
        "failed to send transaction: Transaction simulation failed: Insufficient funds for fee"
      ) {
        addError("Insufficient funds for transaction fee!");
      } else addError(e?.message);
    } finally {
      loadingToggleTrigger(false);
      setPaymentModalToggle(false);
    }
  };

  // wrapper for current balance display component
  const AmountAvailable = ({ invert = false }: { invert?: boolean }) => {
    let isNonFluid = swap;
    if (invert) isNonFluid = !isNonFluid;

    return (
      <div className="amount-avail">
        {isNonFluid
          ? selectedToken === "Select Token"
            ? null
            : `Balance: ${
                tokens
                  ? new TokenAmount(
                      tokens[selectedToken].token,
                      balance
                    ).toExact()
                  : "0"
              }`
          : selectedFluidToken === "Select FLUID"
          ? null
          : `Balance: ${
              tokens
                ? new TokenAmount(
                    tokens[selectedFluidToken].token,
                    fbalance
                  ).toExact()
                : "0"
            }`}
      </div>
    );
  };

  return (
    <ModalToggle.Provider value={modalContext}>
      <div className="swap-box-container flex column">
        <div className="swap-form flex column flex-space-between">
          <FormSection
            defaultMargin={false}
            cname="flex row flex-space-between swap-box-header"
          >
            <Header type="left primary" size="medium">
              Convert
            </Header>
          </FormSection>
          <FormSection cname="swap-field">
            <div className="flex column">
              <Header type="swap-box-subheader left primary" size="medium">
                From
              </Header>
              <div className="flex flex-space-between">
                <Input
                  type="text"
                  theme="input-swap-box"
                  toggle={true}
                  output={(out) =>
                    tokenValueInputHandler(
                      out,
                      setAmount,
                      setAmountRaw,
                      tokens?.[selectedToken]?.token ?? null
                    )
                  }
                  pholder="0.0"
                  value={amount}
                  disabled={
                    selectedToken === "Select Token" &&
                    selectedFluidToken === "Select FLUID"
                  }
                />
              </div>
            </div>
            <div className="swap-field-right">
              <TokenSelect
                type={swap === true ? "token" : "fluid"}
                toggle={swap === true ? togglerTo : togglerFrom}
              />
              <div
                onClick={setMaxBalance}
                className="flex row balance-container"
              >
                {sol.connected && (
                  <>
                    <AmountAvailable />
                    <Button
                      theme={"max-button"}
                      disabled={
                        selectedFluidToken === "Select FLUID" ||
                        selectedToken === "Select Token"
                      }
                      goto={setMaxBalance}
                      label="max"
                    />
                  </>
                )}
              </div>
            </div>
          </FormSection>
          <FormSection cname="flex flex-center">
            <Icon src="i-swap-arrow" trigger={switchSwap} />
          </FormSection>
          <FormSection cname="swap-field">
            <div className="flex column">
              <Header type="swap-box-subheader left primary" size="medium">
                To
              </Header>
              <div className="flex flex-space-between">
                <Input
                  type="text"
                  theme="input-swap-box"
                  toggle={true}
                  output={() => {}}
                  value={amount ?? ""}
                  pholder="0.0"
                  disabled={true}
                />
              </div>
            </div>
            <div className="swap-field-right">
              <TokenSelect
                type={swap === true ? "fluid" : "token"}
                toggle={swap === true ? togglerFrom : togglerTo}
              />
              {sol.connected && <AmountAvailable invert />}
            </div>
          </FormSection>
          <FormSection>
            <Button
              label={`${sol.connected
                ? swap ? "Fluidify your money" : "Revert your fluid"
                : "Connect to Wallet"}`}
              goto={() => { sol.connected ? switchPayment() : connectWallet() }}
              theme={"primary-button raleway bold"}
              padding="py-1"
              disabled={
                //not connected, click to connect
                !sol.connected
                  ? false
                  : //nothing selected
                    selectedToken === "Select Token" ||
                    selectedFluidToken === "Select FLUID" ||
                    //amount is <= 0
                    !(
                      tokens &&
                      new TokenAmount(
                        tokens[selectedToken].token,
                        amountRaw
                      ).greaterThan(0)
                    )
              }
            />
            {/* For Transaction Confirmation */}
            <ConfirmPaymentModal
              type={swap === true ? "token" : "fluid"}
              //display using decimals for the current token (either sol or <token>)
              amount={amount ?? "0"}
              enable={paymentModalToggle}
              toggle={switchPayment}
              //start processing the instruction
              confirmTrigger={initialiseTransaction}
            />
            {/* For when a transaction is successful */}
            <TransactionConfirmationModal
              enable={successTransactionModal}
              toggle={toggleSuccessTransactionModal}
              message={
                <div className="primary-text">Transaction Successful</div>
              }
              transactionHash={previousTransactionHash}
            />
          </FormSection>
        </div>
      </div>
    </ModalToggle.Provider>
  );
};

export default SwapBox;
