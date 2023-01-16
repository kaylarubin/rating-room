import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { INITIAL_VOTE } from "../Constants";
import "../styles/Join.css";
import { JoinData, RoomData } from "../TypeDefinitions";

interface JoinProps {
  setJoinData: (data: JoinData) => void;
  socket: Socket;
}

const Join: React.FC<JoinProps> = (props) => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [roomData, setRoomData] = useState<RoomData>();
  const [userTaken, setUserTaken] = useState<boolean>(false);

  useEffect(() => {
    if (roomData) {
      props.setJoinData({ name: name, roomData: roomData });
    }
  }, [roomData]);

  const joinRoom = (event?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!name || !room) {
      if (event) event.preventDefault();
      return;
    }
    //Check if name is already taken for that room
    props.socket.emit(
      "join",
      { name, room, vote: INITIAL_VOTE },
      (error: string) => {
        if (error) {
          setUserTaken(true);
          return;
        }
      }
    );
    props.socket.on("roomData", (data) => {
      setRoomData(data);
    });
  };

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join Room</h1>
        {userTaken ? (
          <div className="userTakenError">
            Name is already taken for that room.
          </div>
        ) : null}
        <div>
          <input
            placeholder="Name"
            className="joinInput"
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="joinInput mt-20"
            type="text"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyDown={(event) =>
              event.key === "Enter" ? joinRoom(event) : null
            }
          />
        </div>
        <button
          className={"button mt-20"}
          type="submit"
          onClick={() => {
            joinRoom();
          }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
export default Join;
