import { AxiosError } from "axios";
import { JsonRpcProvider } from "ethers/providers";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useWallet } from "use-wallet";
import { apiPOST, apiPOSTBody } from "util/api";
import Routes, { WebsocketUserAction, WebsocketMessage } from "util/api/types";
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
  prizeBoard: Routes['/prize-board']
  messageData: WebsocketMessage
  setMessageData: Dispatch<SetStateAction<WebsocketMessage>>
  setWinAlert: Dispatch<SetStateAction<boolean>>
  setNotificationMessage: Dispatch<SetStateAction<string>>
  setNotificationTrigger: Dispatch<SetStateAction<boolean>>
  lastJsonMessage: any
}

const ApiStateHandler = ({ state }: { state: ApiState }) => {
  const {
    setPastWinnings,
    setPrizeBoard,
    setPrizePool,
    userActions,
    setUserActions,
    messageData,
    setMessageData,
    setWinAlert,
    setNotificationMessage,
    setNotificationTrigger,
    lastJsonMessage,
    prizeBoard
  } = state;

  const wallet = useWallet<JsonRpcProvider>();

  const { addError } = useContext(notificationContext);

  const [userActionsSet, setUserActionsSet] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");

  const handleAxiosError = (error: AxiosError) =>
    error.message === "Network Error" ?
      addError("Network error") :
      addError(`error ${error.message} - try refreshing the page`);

  const setUserActionsOrderDirection = (userActions: WebsocketUserAction[]) =>
    setUserActions(userActions.map((userAction: WebsocketUserAction) => {

      console.warn({"user_action": userAction, "wallet": wallet.account});

      if (userAction.sender_address.toLowerCase() !== wallet.account?.toLowerCase()) {
        userAction.type = "received";
      }

      return userAction;
    }));

  useEffect(() => {
    console.error({"status": wallet.status, "userActions": !userActionsSet});

    if (wallet.account !== null && wallet.account !== "" && !userActionsSet) {

      apiPOSTBody("/my-history", {
        address: wallet.account.toLowerCase(),
        count: 20
      }).then(setUserActionsOrderDirection)
        .catch(handleAxiosError);

      setUserActionsSet(true);
      setWalletAddress(wallet.account);
    }
  }, [setUserActions, wallet.account]);

  useEffect(() => {
    apiPOST("/past-winnings")
      .then(setPastWinnings)
      .catch(handleAxiosError);
  }, [setPastWinnings]);

  useEffect(() => {
    apiPOST("/prize-board")
      .then(setPrizeBoard)
      .catch(handleAxiosError);
  }, [setPrizeBoard]);

  useEffect(() => {
    apiPOST("/prize-pool")
      .then(setPrizePool)
      .catch(handleAxiosError);
  }, [setPrizePool]);

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

      console.warn({"user_action message": user_action, "wallet": wallet.account});

      if (wallet.account?.toLowerCase() === user_action.recipient_address.toLowerCase()) {
        user_action.type = "received";
        const userActions2 = userActions;

        userActions2.unshift(user_action);

        setUserActions(userActions2);
      }

      if (wallet.account?.toLowerCase() === user_action.sender_address.toLowerCase()) {
        user_action.type = "send";

        const userActions2 = userActions;

        userActions2.unshift(user_action);

        setUserActions(userActions2);
      }
    }

    if (messageData?.winner && messageData.winner.winning_amount !== "") {
      const { winner } = messageData;

      if (winner.winner_address == walletAddress) {
        setNotificationMessage(winner.winning_amount.toString());
        setWinAlert(true);
        setNotificationTrigger(true);
      }

      const { winner: {
        winner_address,
        winning_amount,
        awarded_time,
      } } = messageData;

      const prizeBoardEntry = {
        winner_address,
        winning_amount: String(winning_amount),
        awarded_time,
      };

      const prizeBoard2 = prizeBoard;

      prizeBoard2.unshift(prizeBoardEntry);

      setPrizeBoard(prizeBoard2);
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

  return <></>
}

export default ApiStateHandler;
