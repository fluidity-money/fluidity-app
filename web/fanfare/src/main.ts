import { Server } from "socket.io";
import { v4 as uuidv4 } from 'uuid';

const port = process.env.PORT as unknown as number || 3111;
const uid = uuidv4();

const io = new Server(port, {
  cors: {
    origin: "*",
  },
});

// Prepare for commands
io.on("connection", (socket) => {});

console.log(`Fanfare instance {${uid}}: http://localhost:${port}`);