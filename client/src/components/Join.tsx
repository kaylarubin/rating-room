import React, { useState } from "react";
import { Socket } from "socket.io-client";
import "../styles/Join.css";
import { JoinData, SocketResponse } from "../TypeDefinitions";
import { TitleBar } from "./TitleBar";
import { StyledModal } from "./StyledModal";
import { SimplePrompt } from "./SimplePrompt";

const ErrorMessages = {
  USER_TAKEN: "That name is already taken for that room.",
  ROOM_NOT_FOUND: "No room found for that code.",
};

interface JoinProps {
  setJoinData: (data: JoinData) => void;
  socket: Socket;
}

const Join: React.FC<JoinProps> = (props) => {
  const [username, setUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [joinModalOpened, setJoinModalOpened] = useState<boolean>(false);
  const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);

  const nameActive = () => username !== "";

  const subscribeToRoomData = () => {
    props.socket.on("roomData", (data) => {
      props.setJoinData({ username: username, roomData: data });
    });
  };

  const handleJoinRoom = (roomCode: string) => {
    const joinRoomParams = { username: username, roomCode: roomCode };
    props.socket.emit(
      "joinRoom",
      joinRoomParams,
      (response: SocketResponse) => {
        switch (response.status) {
          case "roomNotFound":
            setErrorMessage(ErrorMessages.ROOM_NOT_FOUND);
            break;
          case "userTaken":
            setErrorMessage(ErrorMessages.USER_TAKEN);
            break;
        }
      }
    );
    subscribeToRoomData();
    setJoinModalOpened(false);
  };

  const handleCreateRoom = (roomName: string) => {
    const createRoomParams = { username: username, roomName: roomName };
    props.socket.emit(
      "createRoom",
      createRoomParams,
      (response: SocketResponse) => {
        switch (response.status) {
          case "roomExists":
            //TODO:
            //Handle room already exists error here
            //But we really shouldn't have to. Create room should always succeed.
            //Handle this on server side so this response isn't needed.
            break;
        }
      }
    );
    subscribeToRoomData();
    setCreateModalOpened(false);
  };

  return (
    <>
      <div className="Join__container">
        <TitleBar />
        <div className="joinOuterContainer">
          <div className="joinInnerContainer">
            <h1 className="heading">Join Room</h1>
            <div className="Join__error-message">{errorMessage}</div>
            <div>
              <input
                placeholder="Create Username"
                className="Join__input"
                type="text"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </div>
            <button
              className={`Join__button mt-60 ${
                !nameActive() ? "inactive" : ""
              }`}
              type="submit"
              onClick={() => {
                nameActive() && setJoinModalOpened(true);
              }}
            >
              Join
            </button>
            <button
              className={`Join__button ${!nameActive() ? "inactive" : ""}`}
              type="submit"
              onClick={() => {
                nameActive() && setCreateModalOpened(true);
              }}
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
      <StyledModal
        open={createModalOpened}
        onClose={() => {
          setCreateModalOpened(false);
        }}
      >
        <SimplePrompt
          prompt={"What are we voting for?"}
          placeholder={"Subject"}
          buttonText={"Create"}
          handleEntrySubmit={handleCreateRoom}
        />
      </StyledModal>
      <StyledModal
        open={joinModalOpened}
        onClose={() => {
          setJoinModalOpened(false);
        }}
      >
        <SimplePrompt
          prompt={"Enter Room Code"}
          placeholder={"Room Code"}
          buttonText={"Join"}
          handleEntrySubmit={handleJoinRoom}
        />
      </StyledModal>
    </>
  );
};
export default Join;
