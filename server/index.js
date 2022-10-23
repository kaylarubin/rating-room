const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const router = require("./router");
const { addUser, getUsersInRoom, removeUser } = require("./users");

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

    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    //Call join to subscribe the socket to a given channel
    socket.join(user.room);

    notifyClientsRoomUpdate(user.room);

    callback();
  });

  socket.on("disconnect", () => {
    console.log(`User has left room.`);
    const user = removeUser(socket.id);
    notifyClientsRoomUpdate(user.room);
  });
});

const notifyClientsRoomUpdate = (room) => {
  io.to(room).emit("roomData", {
    room: room,
    users: getUsersInRoom(room),
  });
};

app.use(router);
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));
