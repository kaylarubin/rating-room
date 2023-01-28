import { useState } from "react";
import { io } from "socket.io-client";
import Join from "./Join";
import Room from "./Room";
import { ENDPOINT } from "../Constants";
import { JoinData } from "../TypeDefinitions";

const socket = io(ENDPOINT);

const App = () => {
  const [joinData, setJoinData] = useState<JoinData>();

  return (
    <>
      {joinData === undefined ? (
        <Join setJoinData={setJoinData} socket={socket} />
      ) : (
        <Room joinData={joinData} socket={socket} />
      )}
    </>
  );
};
export default App;
