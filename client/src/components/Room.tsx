import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "../styles/Room.css";
import testIcon from "../assets/jpg/18-waze.jpg";

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

enum Score {
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

const ENDPOINT = "http://localhost:5000";
const INITIAL_VOTE = 0;
let socket: Socket;
const ScoreOptions: Score[] = [
  Score.zero,
  Score.one,
  Score.two,
  Score.three,
  Score.four,
  Score.five,
  Score.six,
  Score.seven,
  Score.eight,
  Score.nine,
  Score.ten,
];
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

interface User {
  id: number;
  name: string;
  room: string;
  vote: number;
}

interface RoomData {
  room: string;
  users: User[];
}

const Room = () => {
  const [name, setName] = useState<string | null>(null);
  const [room, setRoom] = useState<string | null>(null);
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

      setName(userName ?? null);
      setRoom(userRoom ?? null);

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
      <div className="Room__container">
        <div className="Room__title-bar">
          <div className="Room__title-section">
            <h1 className="Room__vote-title-text">Vote</h1>
            <p className="Room__room-title-text">{room}</p>
          </div>
          <div className="Room__user-info">
            <p className="Room__user-info-name">{name}</p>
            <img className="Room__user-info-icon" src={testIcon} />
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
