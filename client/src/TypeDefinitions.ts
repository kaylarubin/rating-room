export interface User {
  id: string;
  name: string;
  room: string;
  vote: number;
  icon: string;
}

export interface Room {
  name: string;
  code: string;
}
export interface RoomData {
  room: Room;
  users: User[];
}
export interface JoinData {
  username: string;
  roomData: RoomData;
}
export interface SocketResponse {
  status: string;
}

export enum Score {
  zero = 0,
  one = 1,
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10,
}
