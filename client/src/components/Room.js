import React, { useContext, useEffect, useRef, useState } from "react";
import queryString from "query-string";
import { UNSAFE_NavigationContext, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

let socket = io(ENDPOINT);

const Room = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
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

      socket.emit("join", { name, room }, (error) => {
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

  useEffect(() => {
    console.log("roomData updated");
  }, [roomData]);

  return (
    <>
      {roomReady ? (
        <div>
          <div>{`Vote: ${room}`}</div>
          <div>{`User: ${name}`}</div>
          <h1>All Users:</h1>
          {roomData.users.map((user) => {
            return <div key={user.id}>{user.name}</div>;
          })}
        </div>
      ) : null}
    </>
  );
};
export default Room;
