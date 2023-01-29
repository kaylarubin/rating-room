const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const crypto = require("crypto");

const PORT = process.env.PORT || 5000;

const { addUser, getUsersInRoom, removeUser, updateUser } = require("./users");
const { addRoom, getRoom } = require("./rooms");

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
  socket.on("joinRoom", ({ username, roomCode }, callback) => {
    //Get room associated with roomCode
    const roomResult = getRoom({ code: roomCode });
    if (roomResult.error) return callback({ status: roomResult.error });
    //Add User associated with roomCode
    const userResult = addUser({
      id: socket.id,
      name: username,
      vote: 0,
      roomCode: roomCode,
    });
    if (userResult.error) return callback({ status: userResult.error });
    //Call join to subscribe the socket to a given channel
    socket.join(roomCode);
    //Notify all users in room of new room data
    notifyClientsRoomUpdate(roomResult.room);
    console.log(
      `User '${username}', has successfully joined roomCode '${roomCode}'`
    );
    callback({ status: "ok" });
  });

  socket.on("createRoom", ({ username, roomName }, callback) => {
    //Create roomCode
    const roomCode = crypto.randomBytes(10).toString("hex");
    //Create room
    const roomResult = addRoom({ name: roomName, code: roomCode });
    if (roomResult.error) return callback({ status: roomResult.error });
    //Add user to room
    const userResult = addUser({
      id: socket.id,
      name: username,
      vote: 0,
      roomCode: roomCode,
    });
    if (userResult.error) return callback({ status: userResult.error });
    //Call join to subscribe the socket to a given channel
    socket.join(roomCode);
    //Notify all users in room of new room data
    notifyClientsRoomUpdate(roomResult.room);
    console.log(`User '${username}', has created room code '${roomCode}'`);
    callback({ status: "ok" });
  });

  socket.on("updateUserData", ({ user, room }) => {
    updateUser(user);
    notifyClientsRoomUpdate(room);
  });

  socket.on("play", ({ roomCode, path }) => {
    io.to(roomCode).emit("play", {
      path: path,
    });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    const roomRes = getRoom({ code: user.roomCode });
    //TODO: check if room is empty somehow
    //if empty remove room

    if (user) {
      console.log(`User '${user.name}', has left room code'${user.roomCode}'`);
      notifyClientsRoomUpdate(roomRes.room);
    }
  });
});

const notifyClientsRoomUpdate = (room) => {
  io.to(room.code).emit("roomData", {
    room: room,
    users: getUsersInRoom(room.code),
  });
};
