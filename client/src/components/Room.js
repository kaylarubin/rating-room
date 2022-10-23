import React, { useContext, useEffect, useRef, useState } from "react";
import queryString from "query-string";
import { UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

let socket = io(ENDPOINT);

const scoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const INITIAL_VOTE = 0;

const Room = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [roomData, setRoomData] = useState({ users: [] });
  const initialMount = useRef(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (initialMount.current) {
      let { name, room } = queryString.parse(window.location.search);
      setRoom(room);
      setName(name);

      socket.emit("join", { name, room, vote: INITIAL_VOTE }, (error) => {
        if (error) {
          navigate("/userTaken");
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
    const user = roomData.users.find((u) => {
      return u.name === name;
    });
    const update = { ...user, vote: option };
    socket.emit("updateUserData", { user: update });
  };

  return (
    <>
      <div>
        <div>{`Vote: ${room}`}</div>
        <div>{`User: ${name}`}</div>
        <h1>All Users:</h1>
        {roomData.users.map((user) => {
          return (
            <div key={user.id}>{`name: ${user.name}, vote: ${user.vote}`}</div>
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
    </>
  );
};
export default Room;
