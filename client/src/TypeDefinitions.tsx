export interface RoomData {
  room: string;
  users: User[];
}
export interface JoinData {
  name: string;
  roomData: RoomData;
}
export interface User {
  id: number;
  name: string;
  room: string;
  vote: number;
  icon: string;
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
