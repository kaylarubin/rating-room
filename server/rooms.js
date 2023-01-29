// interface Room{
//     name: String;
//     code: String;
// }

let rooms = [];

const addRoom = ({ name, code }) => {
  const existingRoom = rooms.find((room) => room.code === code);
  if (existingRoom) return { error: "roomExists" };

  const room = { name, code };
  rooms.push(room);
  return { room: room };
};

const getRoom = ({ code }) => {
  const room = rooms.find((room) => room.code === code);
  if (room == undefined) return { error: "roomNotFound" };
  return { room: room };
};

module.exports = { addRoom, getRoom };
