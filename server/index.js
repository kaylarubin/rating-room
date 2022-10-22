const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    console.log(`User ${name}, has request to join room ${room}`);

    if (error) return callback(error);

    callback();
  });

  socket.on("disconnect", () => {
    console.log(`User has left room.`);
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));
