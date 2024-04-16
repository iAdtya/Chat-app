import express from "express";
const app = express();
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// create server using http
const httpServer = createServer(app);
// create socket server
let io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

// Use socket events
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("new_message", (msg) => {
    let userMessage = {
      username: msg.username,
      message: msg.message,
      id: msg.id,
    };

    console.log("Received message:", userMessage);

    // broadcast this message to all the clients.
    socket.broadcast.emit("broadcast_message", userMessage);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
