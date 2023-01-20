import { PipedTransaction } from "drivers/types";
import io, { ManagerOptions, SocketOptions } from "socket.io-client";

const DSSocketManager = (
  { onCallback = (payload: PipedTransaction) => payload },
  opts?: Partial<ManagerOptions & SocketOptions> | undefined
) => {
  const socket = io(opts);

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
