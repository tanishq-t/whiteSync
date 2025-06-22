/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneraterandString } from "../../../helper/GeneraterandString";
import { KeyRound, User } from "lucide-react";
import { toast } from "react-toastify";

const JoinRoom = ({ socket, setUser }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const navigate = useNavigate();

  const handleJoinRoom = (e) => {
    e.preventDefault();

    // Validate name and roomId
    if (!name) {
      toast.error(`Please enter your name.`, {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    // Regex for a name with at least 3 characters, only letters, and optional spaces

    const nameRegex = /^[a-zA-Z]{3,}(?:\s[a-zA-Z]+)*$/;

    if (!nameRegex.test(name)) {
      toast.error(`Please enter a valid name.`, {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (!roomId) {
      toast.error(`Please enter a Room code.`, {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    // Regex for a Room code with exactly 10 characters, combination of letters and numbers
    const roomIdRegex = /^[a-zA-Z0-9]{10}$/;

    if (!roomIdRegex.test(roomId)) {
      toast.error(`Please enter a valid Room code.`, {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const userData = {
      name,
      roomId,
      userId: GeneraterandString(5),
      host: true,
      presenter: true,
    };

    console.log(userData);
    localStorage.setItem("socketUserData", JSON.stringify(userData));

    setUser(userData);
    // navigate to the whiteboard page
    navigate(`/${roomId}`);

    //emit user details
    socket.emit("userJoinedRoom", userData);
  };

  return (
    <>
      <form className="w-full space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
            <User size={16} className="text-white" />
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
            <KeyRound size={16} className="text-white" />
          </div>
          <input
            type="text"
            placeholder="Enter Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 font-mono tracking-wider"
          />
        </div>

        <div className="pt-4">
          <button
            className="w-full p-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={handleJoinRoom}
          >
            Enter Room
          </button>
        </div>

        {/* Room ID Preview (when entered) */}
        {roomId && (
          <div className="p-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-white/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Joining Room:</p>
                <p className="text-sm font-bold text-white font-mono tracking-widest">{roomId}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default JoinRoom;