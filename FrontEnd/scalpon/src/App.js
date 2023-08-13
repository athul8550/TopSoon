import './App.css';
import CeCard from './components/CeCard';
import socketIOClient from "socket.io-client";
import React, { useState, useEffect } from "react";

function App() {
  const [NiftyData, setNiftyData] = useState(null);
  useEffect(() => {
    const socket = socketIOClient("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socket.on("dataNiftyUpdate", (NiftyData) => {
      console.log("Received data update:", NiftyData[0].last_price);
      setNiftyData(NiftyData[0].last_price)
      // Handle your data here
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, []);
  return (
    <div className="App">
      <h1>NIFTY LTP</h1>
      <h1>{NiftyData}</h1>
      <CeCard />
    </div>
  );
}

export default App;
