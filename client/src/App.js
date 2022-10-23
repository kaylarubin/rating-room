import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Join from "./components/Join";
import Room from "./components/Room";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Join userTaken={false} />} />
        <Route path="/userTaken" element={<Join userTaken={true} />} />
        <Route path="/chat" element={<Room />} />
      </Routes>
    </Router>
  );
};
export default App;
