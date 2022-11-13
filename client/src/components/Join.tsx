import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Join.css";

interface JoinProps {
  userTaken: boolean;
}

const Join: React.FC<JoinProps> = ({ userTaken }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const navigate = useNavigate();

  const joinRoom = (event?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!name || !room) {
      if (event) event.preventDefault();
      return;
    }
    navigate(`/room/${name}/${room}`);
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
            onKeyPress={(event) =>
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
