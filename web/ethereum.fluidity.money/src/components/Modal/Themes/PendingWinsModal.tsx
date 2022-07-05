import { JsonRpcProvider } from "ethers/providers";
import GenericModal from "components/Modal/GenericModal";
import ChainId, { chainIdFromEnv } from "util/chainId";
import Routes from "util/api/types";
import { formatAmount } from "util/amounts";
import { apiPOSTBody } from "util/api";
import { B64ToUint8Array } from "util/conversion";
import { ethers } from "ethers";
import { useContext } from "react";
import { notificationContext } from "components/Notifications/notificationContext";
import { appTheme } from "util/appTheme";

const PendingWinsModal = ({
  enable,
  toggle,
  pendingWins,
  provider,
  fetchNew,
}: {
  enable: boolean;
  toggle: Function;
  pendingWins: Routes["/pending-rewards"];
  provider: JsonRpcProvider;
  fetchNew: Function;
}) => {
  const { addError } = useContext(notificationContext);

  const sendPendingWin = async (hash: string) => {
    // fetch signed reward body
    const { signature } = await apiPOSTBody("/manual-reward", {
      transaction_hash: hash,
    });

    // convert B64 -> []byte -> hex string
    const uint8Signature = B64ToUint8Array(signature);
    const hexSignature = ethers.utils.hexlify(uint8Signature);

    // send signed txn
    try {
      await provider.sendTransaction(hexSignature);
    } catch (e: any) {
      addError(e?.message as string);
    }
  };

  return (
    <GenericModal enable={enable} toggle={() => toggle()}>
      <div className="connect-modal-body">
        <div>
          <h2 className={`primary-text${appTheme}`}>Pending Wins</h2>
          <button onClick={() => fetchNew()}>Refresh</button>
        </div>
        <div style={{ color: "white" }}>
          The following wins will be automatically redeemed at some point, but
          you can redeem them manually now by clicking on one
        </div>
        <div className="connect-modal-form">
          {pendingWins.map((win) => (
            <div
              onClick={() => sendPendingWin(win.transaction_hash)}
              style={{ color: "white" }}
            >
              {win.transaction_hash + " "}
              {win.from_address + " "}
              {win.to_address + " "}
              {win.token_details.token_short_name + " "}
              {formatAmount(
                win.winning_amount,
                win.token_details.token_decimals,
                2
              ) + " "}
            </div>
          ))}
        </div>
      </div>
    </GenericModal>
  );
};

export default PendingWinsModal;
