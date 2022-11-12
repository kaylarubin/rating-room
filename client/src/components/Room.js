import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/Room.css";
import audioFileOne from "../resources/sound/one.mp3";

const ENDPOINT = "http://localhost:5000";
let socket;

const scoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const INITIAL_VOTE = 0;

const Room = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [roomData, setRoomData] = useState({ users: [] });
  const initialMount = useRef(true);

  const navigate = useNavigate();

  const audio = new Audio();

  function handlePlaySound() {
    socket.emit("play", {
      room: room,
      name: "one",
      path: audioFileOne,
    });
  }

  useEffect(() => {
    if (initialMount.current) {
      //initialize socket endpoint
      socket = io(ENDPOINT);

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

      socket.on("play", ({ name, path }) => {
        audio.src = path;
        audio.play();
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
        <h3>All Users:</h3>
        <table>
          <tr>
            <th>Name</th>
            <th>Vote</th>
          </tr>
          {roomData.users.map((user) => {
            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.vote}</td>
              </tr>
            );
          })}
        </table>

        {scoreOptions.map((option) => {
          return (
            <button key={option} onClick={() => updateUserVote(option)}>
              {option}
            </button>
          );
        })}
      </div>

      <button onClick={handlePlaySound}>Play sound</button>
    </>
  );
};
export default Room;
