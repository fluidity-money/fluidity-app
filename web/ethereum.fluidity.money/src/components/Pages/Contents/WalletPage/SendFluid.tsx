import { useEffect, useState, useContext } from "react";
import TokenSelect from "../SwapPage/TokenSelect";
import Input from "components/Input";
import Header from "components/Header";
import Button from "components/Button";
import {
  modalToggle,
  SwapModalStatus,
  userActionContext,
} from "components/context";
import { TokenKind } from "components/types";
import { getBalanceOfERC20, getContract } from "util/contractUtils";
import { useSigner } from "util/hooks";
import contractList, { SupportedFluidContracts } from "util/contractList";
import { ethers } from "ethers";
import { useWallet } from "use-wallet";
import { JsonRpcProvider } from "ethers/providers";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import { decimalTrim } from "util/decimalTrim";
import { notificationContext } from "components/Notifications/notificationContext";
import { isNonZero, trimAmount } from "util/amounts";
import { handleContractErrors } from "util/makeContractSwap";
import { chainIdFromEnv } from "util/chainId";

const SendFluid = () => {
  const [to, setTo] = useState<string>("0.0"); // records amount
  const [toggleTo, setToggleTo] = useState<boolean>(false);
  const [toggleFrom, setToggleFrom] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] =
    useState<TokenKind["symbol"]>("Select Token");
  const [selectedFluidToken, setSelectedFluidToken] =
    useState<TokenKind["symbol"]>("Select FLUID");
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState("0");
  const [successTransactionModal, setSuccessTransactionModal] =
    useState<boolean>(false); // toggle state for the transaction confirmation
  const [decimals, setDecimals] = useState(0); // number of decimal places for the current token

  useEffect(() => {
    if (
      selectedFluidToken === "Select Token" ||
      selectedFluidToken === "Select FLUID"
    )
      return;

    const { decimals } = contractList["ETH"]?.[selectedFluidToken] || {};
    if (decimals) setDecimals(decimals);
  }, [selectedFluidToken]);

  const { addError, addStaticNotification } = useContext(notificationContext);

  // userActions context to update balance when potentially sending/receiving
  const userActions = useContext(userActionContext);

  const signer = useSigner();
  const { status: walletStatus } = useWallet<JsonRpcProvider>();
  const setToWrapper = (value: string) => {
    try {
      if (!value) {
        setTo(decimalTrim(value, decimals + 1));
        return;
      }
      ethers.utils.parseUnits(value.toString(), decimals);
      setTo(value);
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    signer &&
      getBalanceOfERC20(
        selectedFluidToken as SupportedFluidContracts,
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

  // wrap address setter to validate that it's a proper Ethereum address
  const validateAddress = (address: string) => {
    // trim whitespace
    address = address.trim();
    // starts with "0x"
    if (address.length === 1 && address !== "0") {
      addError("Ethereum addresses must start with '0x'!");
      return;
    }
    if (address.length === 2 && address !== "0x") {
      addError("Ethereum addresses must start with '0x'!");
      return;
    }
    if (address.length > 2 && !address.startsWith("0x")) {
      addError("Ethereum addresses must start with '0x'!");
      return;
    }

    // too long
    if (address.length > 42) {
      addError("Address too long - must be 42 characters!");
      return;
    }

    // vaild address, so set
    setAddress(address);
  };

  const sendForm = async () => {
    if (!signer || !to) return;
    // Filters balance by `decimal` digit limit
    const balanceTrimmed = decimalTrim(balance, decimals + 1);
    const toTrimmed = decimalTrim(to, decimals + 1);
    const bigIntBal = ethers.utils.parseUnits(balanceTrimmed, decimals);
    const bigIntAmt = ethers.utils.parseUnits(toTrimmed, decimals);

    if (bigIntBal.lt(bigIntAmt)) {
      addError(`Trying to send ${to}, but balance is only ${balance}`);
      return;
    }

    const contract = getContract(
      "ETH",
      selectedFluidToken as SupportedFluidContracts,
      signer
    );
    let removeNotification: Function = () => 0;

    try {
      // Start loading process
      removeNotification = addStaticNotification("Transaction pending...");
      const transferResult =
        contract && (await contract.transfer(address, bigIntAmt));
      await transferResult.wait();

      setSuccessTransactionModal(true);
    } catch (e) {
      e.arg == "address"
        ? addError(`${address} is an invalid Ethereum address`)
        : await handleContractErrors(e, addError, signer.provider);
    } finally {
      // End of loading process
      removeNotification();
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

  const setterToken = (input: TokenKind["symbol"]) => {
    // update decimals
    if (input !== "Select Token" && input !== "Select FLUID") {
      const { decimals } = contractList["ETH"]?.[input] || {};
      if (decimals) {
        setTo(trimAmount(to, decimals));
        setDecimals(decimals);
      }
    }

    // update token
    setSelectedToken(input);
    return;
  };

  const setterFluidToken = (input: TokenKind["symbol"]) => {
    // update decimals
    if (input !== "Select Token" && input !== "Select FLUID") {
      const { decimals } = contractList["ETH"]?.[input] || {};
      if (decimals) {
        setTo(trimAmount(to, decimals));
        setDecimals(decimals);
      }
    }

    // update token
    setSelectedFluidToken(input);
    return;
  };

  const modalContext: SwapModalStatus = {
    toggleTo: [toggleTo, togglerTo],
    toggleFrom: [toggleFrom, togglerFrom],
    selectedToken: [selectedToken, setterToken],
    selectedFluidToken: [selectedFluidToken, setterFluidToken],
  };

  const aurora = chainIdFromEnv() === 1313161554 ? "--aurora" : "";

  return (
    <modalToggle.Provider value={modalContext}>
      <div className="send-container">
        <h3 className={`primary-text${aurora} send-warning`}>
          Note: not all wallets accept Fluid dollars
        </h3>
        <div className="send-input-container">
          <div className="send-field">
            <Header type="swap-box-subheader left primary" size="medium">
              Address
            </Header>
            <Input
              type="text"
              pholder="0x..."
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
                value={to}
                output={setToWrapper}
                pholder="0.0"
              />
              <TokenSelect type="fluid" toggle={togglerFrom} />
            </div>
          </div>
          <Button
            label="Send"
            goto={sendForm}
            className={`send-button${aurora}`}
            disabled={
              !isNonZero(to, decimals) ||
              !address ||
              !to ||
              walletStatus !== "connected" ||
              selectedFluidToken == "Select FLUID"
            }
          />
          <p
            className={`amount-avail secondary-text${aurora}`}
            onClick={() => setToWrapper(balance)}
          >
            {walletStatus === "connected" ? (
              selectedFluidToken !== "Select FLUID" ? (
                <div className="flex row gap balance-container">
                  {`Balance: ${balance} ${selectedFluidToken}`}
                  <Button
                    theme={"max-button"}
                    disabled={selectedFluidToken === "Select Token"}
                    goto={() => setToWrapper(balance)}
                    label="max"
                  />
                </div>
              ) : null
            ) : (
              "Wallet not connected!"
            )}
          </p>
        </div>
        {/* For when a transaction is successful */}
        <TransactionConfirmationModal
          enable={successTransactionModal}
          toggle={() => setSuccessTransactionModal(false)}
          message={
            <div className={`primary-text${aurora}`}>
              Transaction Successful
            </div>
          }
        />
      </div>
    </modalToggle.Provider>
  );
};

export default SendFluid;
