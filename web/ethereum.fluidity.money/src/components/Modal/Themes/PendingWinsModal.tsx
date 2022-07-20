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
import { getContract } from "util/contractUtils";
import { useSigner } from "util/hooks";

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

  const sendPendingWin = async (shortName: string) => {
    // fetch signed reward body
    const { reward, signature } = await apiPOSTBody("/manual-reward", {
      address: '0x123',
      token_short_name: shortName,
    });

    // convert B64 -> []byte -> hex string
    const uint8Signature = B64ToUint8Array(signature);
    const hexSignature = ethers.utils.hexlify(uint8Signature);

    // send signed txn
    try {
      // TODO
      // contract.manualReward(reward.winner, reward.win_amount, reward.first_block, reward.last_block, signature);
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
          {Object.values(pendingWins).map((win) => (
            <div
              onClick={() => sendPendingWin(win.token_details.token_short_name)}
              style={{ color: "white" }}
            >
              {win.token_details.token_short_name + " "}
              {formatAmount(
                win.amount,
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
