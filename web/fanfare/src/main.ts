import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import { uuid } from "./core/global";

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
});

app.get("/", (req, res) => {
  res.send(`OK {${uuid}}`);
});

httpServer.listen(port, () => {
  console.log(`Fanfare instance {${uuid}} - Listening on :${port}`);
});