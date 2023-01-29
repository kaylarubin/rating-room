import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
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
import { Score, User, RoomData, JoinData } from "../TypeDefinitions";
import { RatingsBar } from "./RatingsBar";
import { APP_ACCENT_COLOR, ScoreOptions } from "../Constants";

import testIcon from "../assets/jpg/18-waze.jpg";

const calculateAverageScore = (users: User[]) => {
  const totalUsers = users.length;
  const scoresSum = users.reduce(function (acc, obj) {
    return acc + obj.vote;
  }, 0);
  return Math.floor(scoresSum / totalUsers);
};

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

interface Props {
  joinData: JoinData;
  socket: Socket;
}

const Room: React.FC<Props> = (props) => {
  const [roomData, setRoomData] = useState<RoomData>(props.joinData.roomData);
  const [selectedScore, setSelectedScore] = useState<number>(0);
  const initialMount = useRef(true);

  const handlePlaySound = (score: Score) => {
    props.socket.emit("play", {
      roomCode: roomData.room.code,
      path: AudioFiles[score],
    });
  };

  useEffect(() => {
    if (initialMount.current) {
      props.socket.on("roomData", (data) => {
        setRoomData(data);
      });

      props.socket.on("play", ({ path }) => {
        new Audio(path).play();
      });

      //On back button
      window.onpopstate = () => {
        props.socket.disconnect();
      };
      return () => {
        initialMount.current = false;
      };
    }
    // eslint-disable-next-line
  }, []);

  const updateUserVote = (score: Score) => {
    setSelectedScore(score);
    const user = roomData.users.find((u) => {
      return u.name === props.joinData.username;
    });
    const update = { ...user, vote: score };
    props.socket.emit("updateUserData", { user: update, room: roomData.room });
  };

  return (
    <>
      <div className="Room__container">
        <TitleBar
          room={roomData.room.name}
          name={props.joinData.username}
          icon={testIcon}
          roomCode={roomData.room.code}
        />
        <RatingsTable users={roomData.users} />
        <div className="Room__average-score-bar">
          <RatingsBar
            label={"Average"}
            score={calculateAverageScore(roomData.users)}
            barColor={APP_ACCENT_COLOR}
            scoreColor={APP_ACCENT_COLOR}
          />
        </div>
        <div className="Room__voting-button-grid-wrap">
          <div className="Room__voting-buttons-container">
            {ScoreOptions.map((option) => {
              return (
                <button
                  className={`Room__score-button ${
                    selectedScore === option ? "selected" : ""
                  }`}
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
        </div>
      </div>
    </>
  );
};
export default Room;
