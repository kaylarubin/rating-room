const { fake_users } = require("./data/fake-users");
const { RunMode } = require("./TypeDefinitions");

let users = [];
if (process.env.NODE_ENV === RunMode.dev) {
  users = fake_users;
}

const addUser = ({ id, name, room, vote }) => {
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (existingUser) {
    return { error: "Username is taken" };
  }

  const user = { id, name, room, vote };
  users.push(user);
  return { user: user };
};

const updateUser = (user) => {
  const index = users.findIndex(
    (u) => u.room === user.room && u.name === user.name
  );
  if (index !== -1) {
    users[index] = user;
  }
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = { addUser, removeUser, getUser, getUsersInRoom, updateUser };
