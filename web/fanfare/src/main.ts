import express from "express";

import { createServer } from "http";
import { Subscriber, Subscription } from "rxjs";
import { Server } from "socket.io";
import config from "./config";

import { uuid } from "./core/global";
import { createEventBus } from "./core/register";
import { Transaction } from "./types/OutputMessage";
import { BelongsToView } from "./views/BelongsToView";

const port = process.env.PORT as unknown as number || 3111;

const app = express();
const httpServer = createServer(app);

httpServer.keepAliveTimeout = 60000;
httpServer.headersTimeout = 65000;

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const { debug } = config;

const registry = new Map<string, Subscription>();

const firehose = createEventBus(
  config,
  ...config.services,
)

let errorState = false;

// Initialize the firehose
firehose
  .subscribe({
    error: error => {
    console.error(error);
    errorState = true;
  }});

// Prepare for commands
io.on("connection", (socket) => {
  const {
    remoteAddress,
    request: { socket: { remotePort } },
  } = socket.conn;

  socket.on("ping", () => {
    console.log(`[ping] ${remoteAddress}:${remotePort}`);
    socket.emit("pong", `pong [${uuid}]`);
  });

  socket.on("subscribeTransactions", ({protocol, address}) => {
    if (registry.has(socket.id)) registry.get(socket.id)?.unsubscribe();

    debug && socket.emit("debug", `Subscribing to ${protocol} ${address}...`)
    
    registry.set(socket.id,
      BelongsToView(firehose, address).subscribe((transaction) => {
        socket.emit("Transactions", transaction);
      })
    )
  })

  socket.on("firehose", () => {
    if (registry.has(socket.id)) registry.get(socket.id)?.unsubscribe();

    console.log(`[firehose] Subscription ${remoteAddress}:${remotePort}`);

    debug && socket.emit("debug", `Subscribing to firehose...`)

    registry.set(socket.id,
      firehose.subscribe((transaction) => {
        socket.emit("Transactions", transaction);
      })
    )
  });

  socket.on("disconnect", () => {
    debug && console.log(`[debug] Unsubscribing ${remoteAddress}:${remotePort}...`)

    registry.get(socket.id)?.unsubscribe();
    registry.delete(socket.id);
  });
});

app.get("/", (req, res) => {
  if (errorState) {
    res.status(500).send(`WARN {${uuid}} - Likely RPC connection error`);
    return;
  }
  res.send(`OK {${uuid}}`);
});

httpServer.listen(port, () => {
  console.log(`Fanfare instance {${uuid}} - Listening on :${port}`);
});
