/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GeneraterandString } from "../../../helper/GeneraterandString";
import { User, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

const CreateRoom = ({ socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  //generating random ID
  const generateRandomString = (length) => {
    return GeneraterandString(length);
  };

  const handleGenerateRoomId = () => {
    setRoomId(generateRandomString(10));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    if (roomId) {
      toast.info(`Room Code copied to clipboard.`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleGenerateRoom = (e) => {
    e.preventDefault(); //to prevent the default behaviour

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
      toast.error(`Please generate a Room code.`, {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const userData = {
      name,
      roomId,
      userId: generateRandomString(5),
      host: true,
      presenter: true,
    };

    setUser(userData);
    console.log(userData);
    localStorage.setItem("socketUserData", JSON.stringify(userData));

    //emit user details
    socket.emit("userJoinedRoom", userData);

    // navigate to the whiteboard page
    navigate(`/${roomId}`);
  };

  return (
    <>
      <form className="w-full space-y-6">
        <div className="flex justify-start items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <User size={16} className="text-white" />
          </div>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <KeyRound size={16} className="text-white" />
            </div>
            <input
              type="text"
              placeholder="Generate room code"
              value={roomId}
              className="flex-1 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 font-mono tracking-wider"
              disabled
            />
            <button
              type="button"
              className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleGenerateRoomId}
            >
              Generate
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={handleGenerateRoom}
          >
            Generate Room
          </button>
          <button
            type="button"
            className="w-full p-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
            onClick={handleCopy}
          >
            Copy Code
          </button>
        </div>

        {/* Room ID Display (when generated) */}
        {roomId && (
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Room Code:</p>
                <p className="text-sm font-bold text-white font-mono tracking-widest">{roomId}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </form>
    </>
  );
};

export default CreateRoom;