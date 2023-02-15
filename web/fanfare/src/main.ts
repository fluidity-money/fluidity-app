import { Server } from "socket.io";
import { randomUUID } from "crypto";

const port = process.env.PORT as unknown as number || 3111;
const uid = randomUUID();

const io = new Server(port, {
  cors: {
    origin: "*",
  },
});

// Prepare for commands
io.on("connection", (socket) => {});

console.log(`Fanfare instance {${uid}}: http://localhost:${port}`);