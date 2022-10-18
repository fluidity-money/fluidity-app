// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

import {useSolana} from "@saberhq/use-solana";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import {QueryParams} from "react-use-websocket/dist/lib/types";
import { apiPOST, apiPOSTBody, root_websocket } from "util/api";
import Routes, { WebsocketUserAction, WebsocketMessage } from "util/api/types";
import {amountToDecimalString} from "util/numbers";
import { notificationContext } from "./Notifications/notificationContext";

// ApiStateHandler performs state updates on API state, allowing for it
// to be handled in one place, and make use of other application context
// like errors
export interface ApiState {
  setPastWinnings: Dispatch<SetStateAction<Routes['/past-winnings']>>
  setPrizeBoard: Dispatch<SetStateAction<Routes['/prize-board']>>
  setPrizePool: Dispatch<SetStateAction<Routes['/prize-pool']>>
  userActions: Routes['/my-history']
  setUserActions: Dispatch<SetStateAction<Routes['/my-history']>>
  mintLimit: Routes['/my-mint-limit']
  setMintLimit: Dispatch<SetStateAction<Routes['/my-mint-limit']>>
  prizeBoard: Routes['/prize-board']
  messageData: WebsocketMessage
  setMessageData: Dispatch<SetStateAction<WebsocketMessage>>
  setWinAlert: Dispatch<SetStateAction<boolean>>
  setNotificationMessage: Dispatch<SetStateAction<string>>
  setNotificationTrigger: Dispatch<SetStateAction<boolean>>
}

// maxPrizeRows for the maximum number of rows to display on the reward board
const maxPrizeRows = 10;
  
const ApiStateHandler = ({ state }: { state: ApiState }) => {
  const {
    setPastWinnings,
    setPrizeBoard,
    setPrizePool,
    setUserActions,
    setMintLimit,
    messageData,
    setMessageData,
    setWinAlert,
    setNotificationMessage,
    setNotificationTrigger,
  } = state;


  const {addError} = useContext(notificationContext);
  const {wallet} = useSolana();

  const [userActionsSet, setUserActionsSet] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [queryParams, setQueryParams] = useState<QueryParams | undefined>(undefined);

  const handleAxiosError = (error: AxiosError) =>
    error.message === "Network Error" ?
      addError("Network error") :
      addError(`error ${error.message} - try refreshing the page`);

  const setUserActionsOrderDirection = (userActions?: WebsocketUserAction[]) =>
    setUserActions(userActions ? userActions.map((userAction: WebsocketUserAction) => {

      console.warn({"user_action": userAction, "wallet": wallet?.publicKey});

      if (wallet?.publicKey && wallet.publicKey.toBase58() === userAction.recipient_address) {
        userAction.type = "received";
      }

      return userAction;
    }) : []);

  const {lastJsonMessage} = useWebSocket(root_websocket, {queryParams, shouldReconnect: (e => e.code === 1005 || e.code === 1006)});

  useEffect(() => {
    console.warn({"connected": wallet?.connected, "userActions": !userActionsSet});

    if (wallet?.publicKey && wallet?.connected && !userActionsSet) {

      apiPOSTBody("/my-history", {
        address: wallet.publicKey.toBase58(),
        count: 20,

      }).then(setUserActionsOrderDirection)
        .catch(handleAxiosError);

      setUserActionsSet(true);
      setWalletAddress(wallet?.publicKey.toBase58());
    }
  }, [setUserActions, wallet?.publicKey, wallet?.connected]);

  useEffect(() => {
    walletAddress && setQueryParams({address: walletAddress});
  }, [walletAddress]);

  useEffect(() => {
    apiPOST("/past-winnings")
      // might have received websocket messages before request completes
      // so don't wipe them out
      .then(value => setPastWinnings(past => [...past, ...value]))
      .catch(handleAxiosError);
  }, []);

  useEffect(() => {
    apiPOST("/prize-board")
      // might have received websocket messages before request completes
      // so don't wipe them out
      // prioritise newest, prepending
      .then(value => setPrizeBoard(past => [...past, ...value].slice(0, maxPrizeRows)))
      .catch(handleAxiosError);
  }, []);

  useEffect(() => {
    apiPOST("/prize-pool")
      .then(setPrizePool)
      .catch(handleAxiosError);
  }, []);

  useEffect(() => {
    if (lastJsonMessage !== null)
      setMessageData(lastJsonMessage as WebsocketMessage);
  }, [lastJsonMessage, setMessageData]);

  useEffect(() => {
    if (messageData?.prize_pool && messageData?.prize_pool.last_updated !== "") {
      setPrizePool(messageData.prize_pool);
    }

    if (messageData?.user_action && wallet?.publicKey) {
      const { user_action } = messageData;

      console.warn({"user_action message": user_action, "wallet": wallet?.publicKey?.toBase58()});

      if (walletAddress === user_action.recipient_address) {
        user_action.type = "received";
        user_action.recipient_address = wallet.publicKey.toBase58();

        setUserActions(userActions => [user_action, ...userActions]);
      }

      else if (walletAddress === user_action.sender_address) {
      // if there's no recipient, it's a swap so don't change
        if (user_action.recipient_address)
          user_action.type = "send";
        user_action.sender_address = wallet.publicKey.toBase58();

        setUserActions(userActions => [user_action, ...userActions]);
      }
    }

    if (messageData.winner && messageData.winner.winning_amount !== "") {
      const {winner} = messageData;
      const {winning_amount, token_details: {token_decimals, token_short_name}} = winner;

      const amountString = amountToDecimalString(winning_amount, token_decimals);

      if (walletAddress === winner.winner_address) {
        setNotificationMessage(`You have just won ${amountString} ${token_short_name}`);
        setWinAlert(true);
        setNotificationTrigger(true);
      }

      const { winner: {
        winner_address,
        awarded_time,
        token_details
      } } = messageData;

      const prizeBoardEntry = {
        winner_address,
        winning_amount: String(winning_amount),
        awarded_time,
        token_details,
      };

      // prioritise newest, prepending
      setPrizeBoard(prizeBoard => [prizeBoardEntry, ...prizeBoard].slice(0, maxPrizeRows));
    }
  },
    [
      messageData,
      setPrizePool,
      setUserActions,
      setNotificationMessage,
      setWinAlert,
      setNotificationTrigger,
      setPrizeBoard
    ]
  );
  
  useEffect(() => {
    if (!walletAddress) return;

    apiPOSTBody("/my-mint-limit", {
      address: walletAddress,
    }).then(setMintLimit)
      .catch(handleAxiosError);

  }, [walletAddress]);

  return <></>
}

export default ApiStateHandler;
