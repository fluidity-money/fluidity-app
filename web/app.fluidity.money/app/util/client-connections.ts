import { PipedTransaction } from "drivers/types";
import io from "socket.io-client";

const DSSocketManager = ({
  onCallback = (payload: PipedTransaction) => payload,
}) => {
  const socket = io("wss://fanfare.fluidity.money", {
    transports: ["websocket"],
  });

  const emitEvent = (protocol: string, address: string) => {
    socket.emit("subscribeTransactions", {
      protocol,
      address,
    });
  };

  // Wait to listen, don't be in a rush ")
  setTimeout(() => {
    socket.on("Transactions", (payload: PipedTransaction) => {
      onCallback(payload);
    });
  }, 10000);

  return {
    emitEvent,
  };
};

export default DSSocketManager;
