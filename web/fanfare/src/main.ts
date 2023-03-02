import express from "express";

import { createServer } from "http";
import { Observable, Subscriber } from "rxjs";
import { Server } from "socket.io";

import { uuid } from "./core/global";
import { Transaction } from "./types/OutputMessage";

import config from "./config";
import { createEventBus } from "./core/register";
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


const registry = new Map<string, Subscriber<Transaction>>();

const firehose = createEventBus(
  ...config.services
)

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

  socket.on("subscribeTransactions", ({ protocol, address }) => {
    if (registry.has(socket.id)) registry.get(socket.id)?.unsubscribe();
    
    BelongsToView(firehose, address).subscribe((transaction) => {
      socket.emit("Transactions", transaction);
    });
  })


  socket.on("disconnect", () => {
    registry.delete(socket.id);
  });
});

app.get("/", (req, res) => {
  res.send(`OK {${uuid}}`);
});

httpServer.listen(port, () => {
  console.log(`Fanfare instance {${uuid}} - Listening on :${port}`);
});