import { PipedTransaction } from "drivers/types";

const DSSocketManager = ({
  onCallback = (payload: PipedTransaction) => payload,
  network = ""
}) => {
  if (network == "") throw new Error(`websocket network to filter for is empty!`);

  const url = new URL("ws://localhost:8888");

  url.pathname = `/${network}`;

  const socket = new WebSocket(url.toString());

  socket.addEventListener("error", (err) => {
    try {
      socket.close(); // hygiene?
    } catch {
      // do nothing
    }

    console.error(`websocket disconnected with err: ${err}`);
  });

  socket.addEventListener("close", () => {
    console.error("websocket disconnected with no reason");
  });

  socket.addEventListener("message", (message) =>
    onCallback(JSON.parse(message.data) as PipedTransaction)
  );

  const emitEvent = (address: string) => {
    if (address == "") throw new Error(`websocket address to filter for is empty!`);
    const message = JSON.stringify(address);
    if (socket.readyState == 1) socket.send(message);
    else socket.addEventListener("open", () => socket.send(message));
  };

  return {
    emitEvent,
  };
};

export default DSSocketManager;
