const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const { addUser, getUsersInRoom, removeUser, updateUser } = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));

io.on("connection", (socket) => {
  socket.on("join", ({ name, room, vote }, callback) => {
    console.log(`User '${name}', has request to join room '${room}'`);

    const { error, user } = addUser({ id: socket.id, name, room, vote });

    if (error) return callback(error);

    //Call join to subscribe the socket to a given channel
    socket.join(user.room);

    //Notify all users in room of new room data
    notifyClientsRoomUpdate(user.room);

    callback();
  });

  socket.on("updateUserData", ({ user }) => {
    updateUser(user);
    notifyClientsRoomUpdate(user.room);
  });

  socket.on("play", ({ room, path }) => {
    io.to(room).emit("play", {
      path: path,
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      console.log(`User '${user.name}', has left room '${user.room}'`);
      notifyClientsRoomUpdate(user.room);
    }
  });
});

const notifyClientsRoomUpdate = (room) => {
  io.to(room).emit("roomData", {
    room: room,
    users: getUsersInRoom(room),
  });
};
