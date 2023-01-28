import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { INITIAL_VOTE } from "../Constants";
import "../styles/Join.css";
import { JoinData, RoomData } from "../TypeDefinitions";
import { TitleBar } from "./TitleBar";
import { StyledModal } from "./StyledModal";
import { SimplePrompt } from "./SimplePrompt";

interface JoinProps {
  setJoinData: (data: JoinData) => void;
  socket: Socket;
}

const Join: React.FC<JoinProps> = (props) => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [roomData, setRoomData] = useState<RoomData>();
  const [userTaken, setUserTaken] = useState<boolean>(false);
  const [joinModalOpened, setJoinModalOpened] = useState<boolean>(false);
  const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);

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
    <>
      <div className="Join__container">
        <TitleBar />
        <div className="joinOuterContainer">
          <div className="joinInnerContainer">
            <h1 className="heading">Join Room</h1>
            {userTaken ? (
              <div className="userTakenError">
                That name is already taken for that room.
              </div>
            ) : null}
            <div>
              <input
                placeholder="Create Username"
                className="joinInput"
                type="text"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            {/* <div>
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
          </div> */}
            <button
              className={"Join__button mt-60"}
              type="submit"
              onClick={() => {
                setJoinModalOpened(true);
                // joinRoom();
              }}
            >
              Join
            </button>
            <button
              className={"Join__button"}
              type="submit"
              onClick={() => {
                setCreateModalOpened(true);
              }}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
      <StyledModal
        open={joinModalOpened}
        onClose={() => {
          setJoinModalOpened(false);
        }}
      >
        <SimplePrompt
          prompt={"What are we voting for?"}
          placeholder={"Subject"}
          buttonText={"Create"}
          onButtonClick={() => setJoinModalOpened(false)}
        />
      </StyledModal>
      <StyledModal
        open={createModalOpened}
        onClose={() => {
          setCreateModalOpened(false);
        }}
      >
        <SimplePrompt
          prompt={"Enter Room Code"}
          placeholder={"Room Code"}
          buttonText={"Join"}
          onButtonClick={() => setCreateModalOpened(false)}
        />
      </StyledModal>
    </>
  );
};
export default Join;
