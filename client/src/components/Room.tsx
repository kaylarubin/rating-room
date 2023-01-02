import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "../styles/Room.css";

import audioFileZero from "../assets/audio/zero.mp3";
import audioFileOne from "../assets/audio/one.mp3";
import audioFileTwo from "../assets/audio/two.mp3";
import audioFileThree from "../assets/audio/three.mp3";
import audioFileFour from "../assets/audio/four.mp3";
import audioFileFive from "../assets/audio/five.mp3";
import audioFileSix from "../assets/audio/six.mp3";
import audioFileSeven from "../assets/audio/seven.mp3";
import audioFileEight from "../assets/audio/eight.mp3";
import audioFileNine from "../assets/audio/nine.mp3";
import audioFileTen from "../assets/audio/ten.mp3";
import { TitleBar } from "./TitleBar";
import { RatingsTable } from "./RatingsTable";
import { Score, User } from "../TypeDefinitions";
import { RatingsBar } from "./RatingsBar";
import { ScoreOptions } from "../Constants";

const users: User[] = [
  { id: 0, name: "kimmy", room: "kay", vote: 0 },
  { id: 0, name: "kimbop", room: "kay", vote: 1 },
  { id: 0, name: "curry", room: "kay", vote: 5 },
  { id: 0, name: "lemon-cello", room: "kay", vote: 6 },
  { id: 0, name: "ChickenTendiesss", room: "kay", vote: 8 },
  { id: 0, name: "DopamineKilla", room: "kay", vote: 3 },
  { id: 0, name: "kimmy", room: "kay", vote: 0 },
  { id: 0, name: "kimbop", room: "kay", vote: 1 },
  { id: 0, name: "curry", room: "kay", vote: 5 },
  { id: 0, name: "lemon-cello", room: "kay", vote: 6 },
  { id: 0, name: "ChickenTendiesss", room: "kay", vote: 8 },
  { id: 0, name: "DopamineKilla", room: "kay", vote: 3 },
];

const calculateAverageScore = (users: User[]) => {
  const totalUsers = users.length;
  const scoresSum = users.reduce(function (acc, obj) {
    return acc + obj.vote;
  }, 0);
  return Math.floor(scoresSum / totalUsers);
};

const ENDPOINT = "http://localhost:5000";
const INITIAL_VOTE = 0;
let socket: Socket;

const AudioFiles = {
  [Score.zero]: audioFileZero,
  [Score.one]: audioFileOne,
  [Score.two]: audioFileTwo,
  [Score.three]: audioFileThree,
  [Score.four]: audioFileFour,
  [Score.five]: audioFileFive,
  [Score.six]: audioFileSix,
  [Score.seven]: audioFileSeven,
  [Score.eight]: audioFileEight,
  [Score.nine]: audioFileNine,
  [Score.ten]: audioFileTen,
};

interface RoomData {
  room: string;
  users: User[];
}

const Room: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [roomData, setRoomData] = useState<RoomData>({ users: [], room: "" });
  const initialMount = useRef(true);
  const { userName, userRoom } = useParams();

  const navigate = useNavigate();

  function handlePlaySound(score: Score) {
    socket.emit("play", {
      room: room,
      path: AudioFiles[score],
    });
  }

  useEffect(() => {
    if (initialMount.current) {
      //initialize socket endpoint
      socket = io(ENDPOINT);

      setName(userName ?? "");
      setRoom(userRoom ?? "");

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

  useEffect(() => {
    //Once name and room are set, have user join via socket
    if (name && room) {
      socket.emit(
        "join",
        { name, room, vote: INITIAL_VOTE },
        (error: string) => {
          if (error) {
            navigate("/userTaken");
          }
        }
      );
    }
  }, [name, room]);

  const updateUserVote = (score: Score) => {
    const user = roomData.users.find((u) => {
      return u.name === name;
    });
    const update = { ...user, vote: score };
    socket.emit("updateUserData", { user: update });
  };

  return (
    <>
      <div className="Room__container" id="room">
        <TitleBar room={room} name={name} />
        <RatingsTable users={users} />
        <div className="Room__average-score-bar">
          <RatingsBar label={"Average"} score={calculateAverageScore(users)} />
        </div>
        <div className="Room__voting-button-grid-wrap">
          <div className="Room__voting-buttons-container">
            {ScoreOptions.map((option) => {
              return (
                <button
                  className="Room__score-button"
                  key={option}
                  onClick={() => {}}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* <div>
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
        <div className="Room__score-button-container">
          {ScoreOptions.map((option) => {
            return (
              <button
                className="Room__score-button"
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
      </div> */}
    </>
  );
};
export default Room;
