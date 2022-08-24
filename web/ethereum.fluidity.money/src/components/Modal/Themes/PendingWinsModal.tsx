// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

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
import { useWallet } from "use-wallet";

const PendingWinsModal = ({
  enable,
  toggle,
  pendingWins,
  fetchNew,
}: {
  enable: boolean;
  toggle: Function;
  pendingWins: Routes["/pending-rewards"];
  fetchNew: Function;
}) => {
  const {addError} = useContext(notificationContext);
  const {account} = useWallet<JsonRpcProvider>() || {};
  const signer = useSigner();

  const sendPendingWin = async(pendingWin: Routes["/pending-rewards"][string]) => {
    if (!account || !signer)
      return;

  const {token_short_name: shortName} = pendingWin.token_details;

  // fetch signed reward body
  const { error, payload} = await apiPOSTBody("/manual-reward", {
    address: account,
    token_short_name: shortName,
  });

  if (error) {
    addError("Failed to make manual reward transaction! " + error);
    return;
  }

  const winnerAddress = account;
  const {signature: b64Signature} = payload;
  const {amount: winAmount, first_block: firstBlock, last_block: lastBlock} = pendingWin;

  // convert B64 -> []byte -> hex string
  const uint8Signature = B64ToUint8Array(b64Signature);
  const hexSignature = ethers.utils.hexlify(uint8Signature);

  // send signed txn
  try {
    const fluidContract = getContract('ETH', `f${shortName}`, signer);
    if (!fluidContract)
      return;

    return await fluidContract.manualReward(winnerAddress, winAmount, firstBlock, lastBlock, hexSignature);
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
              onClick={() => sendPendingWin(win)}
              style={{ color: "white" }}
            >
              {win.token_details.token_short_name + " "}
              {formatAmount(
                win.amount,
                win.token_details.token_decimals,
                4
              ) + " "}
            </div>
          ))}
        </div>
      </div>
    </GenericModal>
  );
};

export default PendingWinsModal;
