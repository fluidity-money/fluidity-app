import { useEffect, useState, useContext } from "react";
import TokenSelect from "../SwapPage/TokenSelect";
import Input from "components/Input";
import Header from "components/Header";
import Button from "components/Button";
import { modalToggle, SwapModalStatus } from "components/context";
import { TokenKind } from "components/types";
import {getBalanceOfERC20, getContract} from "util/contractUtils";
import {useSigner} from "util/hooks";
import {SupportedFluidContracts} from "util/contractList";
import {ethers} from "ethers";
import {useWallet} from "use-wallet";
import {JsonRpcProvider} from "ethers/providers";
import {LoadingStatusToggle} from "components/context";
import TransactionConfirmationModal from "components/Modal/Themes/TransactionConfirmationModal.tsx";
import {decimalTrim} from "util/decimalTrim";
import { notificationContext } from "components/Notifications/notificationContext";
import {isNonZero} from "util/amounts";
import {handleContractErrors} from "util/makeContractSwap";


const SendFluid = () => {
  const [to, setTo] = useState<string>("0.0"); // records amount
  const [toggleTo, setToggleTo] = useState<boolean>(false);
  const [toggleFrom, setToggleFrom] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] =
    useState<TokenKind["type"]>("Select Token");
  const [selectedFluidToken, setSelectedFluidToken] =
    useState<TokenKind["type"]>("Select FLUID");
  const [balance, setBalance] = useState<string>("0");
  const [address, setAddress] = useState("0");
  const [successTransactionModal, setSuccessTransactionModal] = useState<boolean>(false); // toggle state for the transaction confirmation

  const {addError} = useContext(notificationContext);

    // Transaction confirmation modal toggle function
    const toggleSuccessTransactionModal = () => {
      setSuccessTransactionModal(!successTransactionModal);
    }

    const signer = useSigner();
    const {status: walletStatus} = useWallet<JsonRpcProvider>();
    const setToWrapper = (value: string) => {
      try {
        if (!value) {
          setTo(decimalTrim(value, 7));
          return;
        }
        ethers.utils.parseUnits(value.toString(), 6)
        setTo(value)
      } catch(e) {
        return;
      }
    }
    useEffect(() => {
        signer && getBalanceOfERC20(
          selectedFluidToken as SupportedFluidContracts,
          signer
        ).then(r => setBalance(r))
    },[selectedToken, selectedFluidToken, walletStatus, signer])

  // Loading Modal Trigger Function (From App.tsx)
  const loadingToggleTrigger = useContext(LoadingStatusToggle).toggle[1];

  // wrap address setter to validate that it's a proper Ethereum address
  const validateAddress = (address: string) => {
    // trim whitespace
    address = address.trim();
    // starts with "0x"
    if (address.length === 1 && address !== "0") {
      addError("Ethereum addresses must start with '0x'!")
      return;
    }
    if (address.length === 2 && address !== "0x") {
      addError("Ethereum addresses must start with '0x'!")
      return;
    }
    if (address.length > 2 && !address.startsWith("0x")) {
      addError("Ethereum addresses must start with '0x'!")
      return;
    }

    // too long
    if (address.length > 42) {
      addError("Address too long - must be 42 characters!");
      return;
    }
  
    // vaild address, so set
    setAddress(address);
  }

  const sendForm = async() => {
    if (!signer || !to) return;
    // Filters balance by 6 digit limit
    const balanceTrimmed = decimalTrim(balance, 7);
    const toTrimmed = decimalTrim(to, 7);
    const bigIntBal = ethers.utils.parseUnits(balanceTrimmed, 6)
    const bigIntAmt = ethers.utils.parseUnits(toTrimmed, 6)

    if (bigIntBal.lt(bigIntAmt)) {
      addError(`Trying to send ${to}, but balance is only ${balance}`);
      return;
    }
    //TODO f<> <>Fluid naming scheme needs to be fixed
    const contract = getContract('ETH', selectedFluidToken as SupportedFluidContracts, signer)
    try {
      // Start loading process
      loadingToggleTrigger(true);
      const transferResult = contract && await contract.transfer(address, bigIntAmt);
      await transferResult.wait();

      toggleSuccessTransactionModal()
    } catch(e) {
      e.arg == 'address' ?
        addError(`${address} is an invalid Ethereum address`) :
        await handleContractErrors(e, addError, signer.provider)
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
              <Button theme={"max-button"} disabled={selectedFluidToken === "Select Token"} goto={() => setTo(balance)} label="max" />
              <TokenSelect type="fluid" toggle={togglerFrom} />
            </div>
          </div>
          <Button label="Send" goto={sendForm} className="send-button" disabled={!isNonZero(to) || !address || !to || walletStatus !== 'connected' || selectedFluidToken == 'Select FLUID'}/>
          <p className="amount-avail secondary-text">
            {walletStatus === 'connected' ?
              selectedFluidToken !== "Select FLUID" ?
                <>
                  {`Balance: ${balance} ${selectedFluidToken}`}
                </> :
                null
            : "Wallet not connected!"}
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
