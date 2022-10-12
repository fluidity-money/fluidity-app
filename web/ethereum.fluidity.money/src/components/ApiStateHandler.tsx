// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import { AxiosError } from "axios";
import { JsonRpcProvider } from "ethers/providers";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useWallet } from "use-wallet";
import { formatAmount } from "util/amounts";
import { apiPOST, apiPOSTBody } from "util/api";
import Routes, { WebsocketUserAction, WebsocketMessage } from "util/api/types";
import { notificationContext } from "./Notifications/notificationContext";

// ApiStateHandler performs state updates on API state, allowing for it
// to be handled in one place, and make use of other application context
// like errors
export interface ApiState {
  setPastWinnings: Dispatch<SetStateAction<Routes["/past-winnings"]>>;
  setPrizeBoard: Dispatch<SetStateAction<Routes["/prize-board"]>>;
  setPrizePool: Dispatch<SetStateAction<Routes["/prize-pool"]>>;
  userActions: Routes["/my-history"];
  setUserActions: Dispatch<SetStateAction<Routes["/my-history"]>>;
  prizeBoard: Routes["/prize-board"];
  messageData: WebsocketMessage;
  setMessageData: Dispatch<SetStateAction<WebsocketMessage>>;
  setWinAlert: Dispatch<SetStateAction<boolean>>;
  setNotificationMessage: Dispatch<SetStateAction<string>>;
  setNotificationTrigger: Dispatch<SetStateAction<boolean>>;
  lastJsonMessage: any;
}

// maxPrizeRows for the maximum number of rows to display on the reward board
const maxPrizeRows = 10;

const ApiStateHandler = ({ state }: { state: ApiState }) => {
  const {
    setPastWinnings,
    setPrizeBoard,
    setPrizePool,
    setUserActions,
    messageData,
    setMessageData,
    setWinAlert,
    setNotificationMessage,
    setNotificationTrigger,
    lastJsonMessage,
    prizeBoard,
  } = state;

  const wallet = useWallet<JsonRpcProvider>();

  const { addError } = useContext(notificationContext);

  const [userActionsSet, setUserActionsSet] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");

  const handleAxiosError = (error: AxiosError) =>
    error.message === "Network Error"
      ? addError("Network error")
      : addError(`error ${error.message} - try refreshing the page`);

  const setUserActionsOrderDirection = (userActions: WebsocketUserAction[]) =>
    setUserActions(
      userActions.map((userAction: WebsocketUserAction) => {
        console.warn({ user_action: userAction, wallet: wallet.account });

        if (
          userAction.sender_address.toLowerCase() !==
          wallet.account?.toLowerCase()
        ) {
          userAction.type = "received";
        }

        return userAction;
      })
    );

  useEffect(() => {
    console.error({ status: wallet.status, userActions: !userActionsSet });

    if (wallet.account !== null && wallet.account !== "" && !userActionsSet) {
      apiPOSTBody("/my-history", {
        address: wallet.account.toLowerCase(),
        count: 20,
      })
        .then(setUserActionsOrderDirection)
        .catch(handleAxiosError);

      setUserActionsSet(true);
      setWalletAddress(wallet.account);
    }
  }, [setUserActions, wallet.account]);

  useEffect(() => {
    apiPOST("/past-winnings")
      // might have received websocket messages before request completes
      // so don't wipe them out
      .then((value) => setPastWinnings((past) => [...past, ...value]))
      .catch(handleAxiosError);
  }, []);

  useEffect(() => {
    apiPOST("/prize-board")
      // might have received websocket messages before request completes
      // so don't wipe them out
      .then((value) =>
        setPrizeBoard((past) => [...past, ...value].slice(0, maxPrizeRows))
      )
      .catch(handleAxiosError);
  }, []);

  useEffect(() => {
    apiPOST("/prize-pool").then(setPrizePool).catch(handleAxiosError);
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null)
      setMessageData(lastJsonMessage as WebsocketMessage);
  }, [lastJsonMessage, setMessageData]);

  useEffect(() => {
    if (messageData?.prize_pool && messageData.prize_pool.last_updated !== "") {
      setPrizePool(messageData.prize_pool);
    }

    if (messageData?.user_action) {
      const { user_action } = messageData;

      console.warn({
        "user_action message": user_action,
        wallet: wallet.account,
      });

      if (
        wallet.account?.toLowerCase() ===
        user_action.recipient_address.toLowerCase()
      ) {
        user_action.type = "received";
        setUserActions((userActions) => [user_action, ...userActions]);
      }

      else if (
        wallet.account?.toLowerCase() ===
        user_action.sender_address.toLowerCase()
      ) {
        // if there's no recipient, it's a swap so don't change
        if (user_action.recipient_address)
          user_action.type = "send";

        setUserActions((userActions) => [user_action, ...userActions]);
      }
    }

    if (messageData?.winner && messageData.winner.winning_amount !== "") {
      const { winner } = messageData;
      const {
        winning_amount,
        winner_address,
        token_details: { token_decimals, token_short_name },
      } = winner;

      const amountString = formatAmount(winning_amount, token_decimals);

      if (winner_address == walletAddress) {
        setNotificationMessage(
          `You have just been rewarded ${amountString} f${token_short_name}!`
        );
        setWinAlert(true);
        setNotificationTrigger(true);
      }

      const {
        winner: { awarded_time },
      } = messageData;

      const prizeBoardEntry = {
        winner_address,
        winning_amount: String(winning_amount),
        awarded_time,
        token_details: { token_decimals, token_short_name },
      };

      setPrizeBoard((prizeBoard) =>
        [prizeBoardEntry, ...prizeBoard].slice(0, maxPrizeRows)
      );
    }
  }, [
    messageData,
    setPrizePool,
    setUserActions,
    setNotificationMessage,
    setWinAlert,
    setNotificationTrigger,
    setPrizeBoard,
  ]);

  return <></>;
};

export default ApiStateHandler;
