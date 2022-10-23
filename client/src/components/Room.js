import React, { useContext, useEffect, useRef, useState } from "react";
import queryString from "query-string";
import { UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

let socket = io(ENDPOINT);

const scoreOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Room = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [vote, setVote] = useState(1);
  const [error, setError] = useState(false);
  const [roomReady, setRoomReady] = useState(false);
  const [roomData, setRoomData] = useState([]);
  const initialMount = useRef(true);

  const navigate = useNavigate();
  if (error) {
    navigate("/userTaken");
  }

  useEffect(() => {
    if (initialMount.current) {
      const { name, room } = queryString.parse(window.location.search);

      setRoom(room);
      setName(name);

      socket.emit("join", { name, room, vote }, (error) => {
        if (error) {
          setError(true);
        } else {
          setRoomReady(true);
        }
      });

      socket.on("roomData", (data) => {
        setRoomData(data);
      });

      //On back button
      window.onpopstate = () => {
        socket.disconnect();
      };

      return () => {
        initialMount.current = false;
      };
    }
  }, []);

  const updateUserVote = (option) => {
    const user = roomData.users.find((u) => u.name === name);
    const update = { ...user, vote: option };
    socket.emit("updateUserData", { user: update });
  };

  return (
    <>
      {roomReady ? (
        <div>
          <div>{`Vote: ${room}`}</div>
          <div>{`User: ${name}`}</div>
          <h1>All Users:</h1>
          {roomData.users.map((user) => {
            return (
              <div
                key={user.id}
              >{`name: ${user.name}, vote: ${user.vote}`}</div>
            );
          })}
          {scoreOptions.map((option) => {
            return (
              <button key={option} onClick={() => updateUserVote(option)}>
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
};
export default Room;
