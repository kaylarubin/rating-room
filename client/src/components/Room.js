import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "../styles/Room.css";

import audioFileZero from "../resources/sound/zero.mp3";
import audioFileOne from "../resources/sound/one.mp3";
import audioFileTwo from "../resources/sound/two.mp3";
import audioFileThree from "../resources/sound/three.mp3";
import audioFileFour from "../resources/sound/four.mp3";
import audioFileFive from "../resources/sound/five.mp3";
import audioFileSix from "../resources/sound/six.mp3";
import audioFileSeven from "../resources/sound/seven.mp3";
import audioFileEight from "../resources/sound/eight.mp3";
import audioFileNine from "../resources/sound/nine.mp3";
import audioFileTen from "../resources/sound/ten.mp3";

const ENDPOINT = "http://localhost:5000";
let socket;

const scoreOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const audioFiles = {
  0: audioFileZero,
  1: audioFileOne,
  2: audioFileTwo,
  3: audioFileThree,
  4: audioFileFour,
  5: audioFileFive,
  6: audioFileSix,
  7: audioFileSeven,
  8: audioFileEight,
  9: audioFileNine,
  10: audioFileTen,
};
const INITIAL_VOTE = 0;

const Room = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [roomData, setRoomData] = useState({ users: [] });
  const initialMount = useRef(true);

  const navigate = useNavigate();

  function handlePlaySound(score) {
    socket.emit("play", {
      room: room,
      path: audioFiles[score],
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

      socket.on("play", ({ path }) => {
        new Audio(path).play();
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
            <button
              key={option}
              onClick={() => {
                updateUserVote(option);
                handlePlaySound(option);
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </>
  );
};
export default Room;
