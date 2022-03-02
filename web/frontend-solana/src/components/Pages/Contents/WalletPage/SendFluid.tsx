import { useEffect, useState, useContext} from "react";
import TokenSelect from "../SwapPage/TokenSelect";
import Input from "components/Input";
import Header from "components/Header";
import Button from "components/Button";
import { modalToggle, SwapModalStatus, userActionContext } from "components/context";
import { TokenKind } from "components/types";
import {getBalanceOfSPL} from "util/contractUtils";
import {LoadingStatusToggle} from "components/context";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import {useFluidToken} from "util/hooks";
import {useSolana} from "@saberhq/use-solana";
import {sendSol} from "util/solana/transaction";
import {PublicKey} from "@solana/web3.js";
import {TokenAmount} from "@saberhq/token-utils";
import BN from "bn.js";
import {rawToDisplayString, tokenValueInputHandler} from "util/numbers";
import {notificationContext} from "components/Notifications/notificationContext";

const SendFluid = () => {
  const sol = useSolana();
  const tokens = useFluidToken();
  const {addError} = useContext(notificationContext);
  const [toRaw, setToRaw] = useState(""); // records amount
  const [to, setTo] = useState(""); //displays amount (user-friendly)
  const [toggleTo, setToggleTo] = useState<boolean>(false);
  const [toggleFrom, setToggleFrom] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] =
    useState<TokenKind["type"]>("Select Token");
  const [selectedFluidToken, setSelectedFluidToken] =
    useState<TokenKind["type"]>("Select FLUID");
  const [balance, setBalance] = useState("0");
  const [address, setAddress] = useState("");
  const [successTransactionModal, setSuccessTransactionModal] = useState<boolean>(false); // toggle state for the transaction confirmation

  // userActions context to update balance when potentially sending/receiving
  const userActions = useContext(userActionContext);

  // Transaction confirmation modal toggle function
  const toggleSuccessTransactionModal = () => {
    setSuccessTransactionModal(!successTransactionModal);
  }

  //would be more performant to memoise balances, but this would make it overly complex to update them
  //so instead just fetch every time
  useEffect(() => {
      const fluidToken = tokens?.[selectedFluidToken];
      // Balance of Fluid
      fluidToken && sol.publicKey && getBalanceOfSPL(
        fluidToken,
        sol.connection,
        sol.publicKey
        ).then(bal => setBalance(bal.amount ?? "0"));
  },[selectedToken, selectedFluidToken, tokens?.[selectedToken], successTransactionModal, userActions.length])


  // Loading Modal Trigger Function (From App.tsx)
  const loadingToggleTrigger = useContext(LoadingStatusToggle).toggle[1];

  // wrap address setter to trim whitespace
  const validateAddress = (address: string) => {
    address = address.trim();
    setAddress(address);
  }

  const sendForm = async() => {
    if (!tokens || !toRaw) return;

    if (new BN(balance).lt(new BN(toRaw))) {
      addError(`Trying to send ${new TokenAmount(tokens[selectedFluidToken], toRaw).toExact()}, but balance is ${rawToDisplayString(tokens[selectedFluidToken], balance)}`);
      return;
    }
    //TODO f<> <>Fluid naming scheme needs to be fixed

    try {
      // Start loading process
      loadingToggleTrigger(true);
      const result = await sendSol(sol, new PublicKey(address), new TokenAmount(tokens[selectedFluidToken], toRaw), addError);
      console.log(result);
      toggleSuccessTransactionModal()
    } catch (e: any) {
      addError(`Failed to send tokens! ${e?.message}`);
    }
    finally {
      // End of loading process
      loadingToggleTrigger(false);
    }
  };

  // Modal context definition
  const togglerTo = () => {
    setToggleTo(!toggleTo);
    return;
  };

  const togglerFrom = () => {
    setToggleFrom(!toggleFrom);
    return;
  };

  const setterToken = (input: TokenKind["type"]) => {
    setSelectedToken(input);
    return;
  };

  const setterFluidToken = (input: TokenKind["type"]) => {
    setSelectedFluidToken(input);
    return;
  };

  const modalContext: SwapModalStatus = {
    toggleTo: [toggleTo, togglerTo],
    toggleFrom: [toggleFrom, togglerFrom],
    selectedToken: [selectedToken, setterToken],
    selectedFluidToken: [selectedFluidToken, setterFluidToken],
  };

  const setMaxBalance = () => {
    if (!tokens)
      return;

    const balanceString = new TokenAmount(tokens[selectedFluidToken], balance).toFixed();
    tokenValueInputHandler(balanceString, setTo, setToRaw, tokens[selectedFluidToken])
  }

  return (
    <modalToggle.Provider value={modalContext}>
      <div className="send-container">
        <h3 className="primary-text send-warning">
          Note: not all wallets accept Fluid dollars
        </h3>
        <div className="send-input-container">
          <div className="send-field">
            <Header type="swap-box-subheader left primary" size="medium">
              Address
            </Header>
            <Input
              type="text"
              pholder="Enter a Solana address..."
              toggle={false}
              theme="input-swap-box input address-input"
              output={validateAddress}
              value={address}
            />
          </div>
          <div className="send-field">
            <Header type="swap-box-subheader left primary" size="medium">
              Amount
            </Header>
            <div className="flex flex-space-between">
              <Input
                type="text"
                theme="input-swap-box"
                toggle={true}
                value={tokens?.[selectedFluidToken] && to ? to : ""}
                output={(out) => tokenValueInputHandler(out, setTo, setToRaw, tokens?.[selectedFluidToken] || null)}
                pholder="0.0"
                disabled={selectedFluidToken === "Select FLUID"}
              />
              <TokenSelect type="fluid" toggle={togglerFrom} />
            </div>
          </div>
          <Button
            label="Send"
            goto={sendForm}
            className="send-button"
            disabled={!address || !to || !sol.connected || selectedFluidToken == 'Select FLUID'}
          />
          <p className="amount-avail" onClick={setMaxBalance}>
            {sol.connected ?
              selectedFluidToken !== "Select FLUID" ?
              // show balance if a token is selected and wallet is connected
                <div className="flex row gap balance-container">
                  {`Balance: ${tokens && new TokenAmount(tokens[selectedFluidToken], balance.toString()).toExact()} ${selectedFluidToken}`}
                  <Button theme={"max-button"} goto={setMaxBalance} label="max" />
                </div> :
              null :
              "Wallet not connected!"
            }
          </p>
        </div>
        {/* For when a transaction is successful */}
        <TransactionConfirmationModal
          enable={successTransactionModal}
          toggle={toggleSuccessTransactionModal}
          message={<div className="primary-text">Transaction Successful</div>}
        />
      </div>
    </modalToggle.Provider>
  );
};

export default SendFluid;
