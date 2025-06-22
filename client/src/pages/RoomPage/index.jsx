/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { WhiteBoard } from "../../components/WhiteBoard";
import { Userbar } from "../../components/Userbar";
import { ChatBox } from "../../components/ChatBox";
import { toast } from "react-toastify";

//icons
import pencilIcon from "../../assets/pencil.png";
import lineIcon from "../../assets/diagonal-line.png";
import rectIcon from "../../assets/rounded-rectangle.png";
import eraserIcon from "../../assets/Eraser.png";
import Popup from "../../components/EraserResizePopUp";

export const RoomPage = ({ user, socket }) => {
  const navigate = useNavigate();

  const popupRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [tool, setTool] = useState("pencil"); // Select tool
  const [color, setColor] = useState("black"); // select color
  const [elements, setElements] = useState([]); // array of different "drawing events"(elements)
  const [removedElements, setRemovedElements] = useState([]); // array of undo elements
  const [usersInRoom, setUsersInRoom] = useState([]); // array of users in a room
  const [isUserpanel, setIsUserPanel] = useState(false);
  const [isChatBox, setIsChatBox] = useState(false);

  // update users state
  useEffect(() => {
    // add users in a array(usersInRoom)
    socket.on("userIsJoined", ({ users }) => {
      console.log(users);
      setUsersInRoom(users);
    });

    // notify user join event
    socket.on("userJoinedRoom", ({ success, user }) => {
      console.log("toast check: ");
      console.log(user);
      if (success) {
        toast.info(`${user.name} has joined the room.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    });

    // notify user leave event
    socket.on("onDisconnect", ({ name, socketId }) => {
      toast.info(`${name} has left the room.`, {
        position: toast.POSITION.TOP_CENTER,
      });
      setUsersInRoom((prevUser) => {
        return prevUser.filter((user) => user.socketId !== socketId);
      });
    });
  }, [socket, elements]);

  // handle clear canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    console.log("Cleared. elements array length: " + elements.length);
  };

  //handle Leave Room
  const handleLeaveRoom = () => {
    localStorage.removeItem("socketUserData");
    localStorage.removeItem("firstLoadDone");
    navigate("/");
  };

  //handle undo
  const handleUndo = (e) => {
    e.preventDefault();
    setRemovedElements((prevElm) => {
      console.log("removed: " + prevElm.length);
      return [...prevElm, elements[elements.length - 1]];
    });
    setElements((prevElm) => {
      console.log("prev-elements: " + prevElm.length);
      return prevElm.slice(0, prevElm.length - 1);
    });
    console.log("elements: " + elements.length);
  };

  //handle redo
  const handleRedo = (e) => {
    e.preventDefault();
    setElements((prevElm) => {
      return [...prevElm, removedElements[removedElements.length - 1]];
    });
    setRemovedElements((prevElm) => {
      return prevElm.slice(0, prevElm.length - 1);
    });
  };

  const openModal = () => {
    if (popupRef.current) {
      popupRef.current.openModal();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* main div of canvas page */}
      <div className="flex h-screen py-2 md:flex-row flex-col justify-center items-center gap-3 px-2">
        
        {/* Left Toolbar Panel */}
        <div className="md:w-[15%] w-[90vw] h-[100%] p-2 md:p-0 md:max-h-[1000px] md:mt-0 md:max-w-[400px] flex flex-col">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm p-4 h-full">
            {/* toolbar implementation */}
            <div className="flex flex-col w-[100%] justify-center items-center md:h-[100%]">
              
              {/* Undo and Redo Button element for desktop view, hidden in mobile view */}
              <div className="p-2 gap-3 justify-center hidden md:flex items-center w-[100%]">
                <button
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  onClick={handleUndo}
                  disabled={elements.length <= 0}
                >
                  Undo
                </button>
                <button
                  className="px-4 py-2 rounded-xl border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:border-slate-600 disabled:text-slate-500 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleRedo}
                  disabled={removedElements.length <= 0}
                >
                  Redo
                </button>
              </div>

              {/* Leave Room Button component for mobile view, hidden in desktop view */}
              <div className="md:hidden mb-3 mt-16">
                <button
                  onClick={handleLeaveRoom}
                  className="px-6 py-3 w-[90vw] max-w-[300px] rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Leave Room
                </button>
              </div>

              {/* Choose drawing element start */}
              <div className="flex justify-center mt-10 items-center md:h-[80%]">
                <div className="flex md:flex-col bg-slate-800/50 border border-slate-600 rounded-2xl p-3 shadow-xl backdrop-blur-sm">
                  
                  <div className="flex p-3 gap-3 items-center hover:bg-slate-700/50 rounded-xl transition-all duration-300 cursor-pointer group">
                    <img className="w-6 h-6 filter brightness-75 group-hover:brightness-100 transition-all duration-300" src={pencilIcon} alt="pencil" />
                    <input
                      type="radio"
                      name="tool"
                      id="pencil"
                      value="pencil"
                      checked={tool === "pencil"}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                      onChange={(e) => setTool(e.target.value)}
                    />
                  </div>

                  <div className="flex p-3 gap-3 items-center hover:bg-slate-700/50 rounded-xl transition-all duration-300 cursor-pointer group">
                    <img className="w-6 h-6 filter brightness-75 group-hover:brightness-100 transition-all duration-300" src={lineIcon} alt="line" />
                    <input
                      type="radio"
                      name="tool"
                      id="line"
                      value="line"
                      checked={tool === "line"}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                      onChange={(e) => setTool(e.target.value)}
                    />
                  </div>

                  <div className="flex p-3 gap-3 items-center hover:bg-slate-700/50 rounded-xl transition-all duration-300 cursor-pointer group">
                    <img className="w-6 h-6 filter brightness-75 group-hover:brightness-100 transition-all duration-300" src={rectIcon} alt="rectangle" />
                    <input
                      type="radio"
                      name="tool"
                      id="rect"
                      value="rect"
                      checked={tool === "rect"}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                      onChange={(e) => setTool(e.target.value)}
                    />
                  </div>

                  <div
                    className="flex p-3 gap-3 items-center hover:bg-slate-700/50 rounded-xl transition-all duration-300 cursor-pointer group"
                    onClick={openModal}
                  >
                    <img className="w-6 h-6 filter brightness-75 group-hover:brightness-100 transition-all duration-300" src={eraserIcon} alt="eraser" />
                    <input
                      type="radio"
                      name="tool"
                      id="eraser"
                      value="eraser"
                      checked={tool === "eraser"}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                      onChange={(e) => setTool(e.target.value)}
                    />
                    <Popup ref={popupRef} />
                  </div>
                </div>
              </div>

              {/* Color picker element for desktop view, hidden in mobile view */}
              <div className="hidden md:block mt-6">
                <div className="flex items-center bg-slate-800/50 rounded-xl p-3 border border-slate-600">
                  <label htmlFor="color" className="text-slate-300 font-medium mr-3">Color:</label>
                  <input
                    type="color"
                    id="color"
                    className="w-10 h-10 rounded-full border-2 border-slate-600 bg-transparent cursor-pointer hover:scale-110 transition-transform duration-300"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>

              {/* Leave Room Button for desktop view, hidden in mobile view */}
              <div className="hidden md:block mt-6">
                <button
                  onClick={handleLeaveRoom}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  Leave Room
                </button>
              </div>

              <div className="flex w-[100%] justify-between mt-4 items-center">
                {/* color picker for mobile view, hidden in desktop view */}
                <div className="md:hidden">
                  <div className="flex items-center bg-slate-800/50 rounded-xl p-2 border border-slate-600">
                    <label htmlFor="color" className="text-slate-300 font-medium mr-2 text-sm">Color:</label>
                    <input
                      type="color"
                      id="color"
                      className="w-8 h-8 rounded-full border-2 border-slate-600 bg-transparent cursor-pointer"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                  </div>
                </div>

                {/* undo and redo button for mobile view, hidden in desktop view */}
                <div className="flex md:hidden justify-between items-center">
                  <div className="p-2 gap-2 justify-center md:hidden flex items-center w-[100%]">
                    <button
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:transform-none text-sm"
                      onClick={handleUndo}
                      disabled={elements.length <= 0}
                    >
                      Undo
                    </button>
                    <button
                      className="px-3 py-2 rounded-xl border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:border-slate-600 disabled:text-slate-500 disabled:hover:bg-transparent disabled:hover:text-slate-500 disabled:cursor-not-allowed disabled:transform-none text-sm"
                      onClick={handleRedo}
                      disabled={removedElements.length <= 0}
                    >
                      Redo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="md:w-[65%] w-[90vw] md:h-[100%] h-[60%] my-3 md:my-0 md:max-h-[1000px] flex flex-col justify-center md:max-w-[1500px] items-center">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm p-4 w-full h-full">
            {/* Whiteboard Implementation */}
            <div className="w-[100%] h-[100%] border-4 border-dashed border-slate-600 rounded-xl bg-white shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-20 pointer-events-none"></div>
              <WhiteBoard
                canvasRef={canvasRef}
                ctxRef={ctxRef}
                elements={elements}
                setElements={setElements}
                tool={tool}
                color={color}
                socket={socket}
                user={user}
              />
            </div>

            {/* Users Panel */}
            {isUserpanel && (
              <Userbar
                usersInRoom={usersInRoom}
                user={user}
                setIsChatBox={setIsChatBox}
                setIsUserPanel={setIsUserPanel}
              />
            )}
            {/* Chat Box */}
            {isChatBox && (
              <ChatBox
                socket={socket}
                UserInRoom={usersInRoom}
                user={user}
                setIsChatBox={setIsChatBox}
                setIsUserPanel={setIsUserPanel}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:w-[20%] md:mt-2 w-[90vw] h-[100%] md:max-h-[1000px] flex flex-col p-3 mb-10 md:max-w-[400px] md:mb-0">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-sm p-6 h-full">
            {/* Utils Button */}
            <div className="md:flex-col flex justify-between md:h-[100%] w-[100%]">
              
              {/* Clear Canvas Button */}
              <div className="flex justify-between md:justify-center items-center">
                <button
                  onClick={handleClearCanvas}
                  className="px-4 py-2 bg-slate-800/50 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                >
                  Clear Canvas
                </button>
              </div>

              {/* Decorative Space */}
              <div className="md:block hidden bg-gradient-to-br from-slate-800/30 to-slate-700/30 w-[100%] h-[80%] rounded-xl border border-slate-600/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-full blur-lg"></div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center items-center md:relative md:-top-[10px] gap-3">
                <button
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsUserPanel(true);
                    setIsChatBox(false);
                  }}
                >
                  People
                </button>
                <button
                  className="px-4 py-2 rounded-xl border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsChatBox(true);
                    setIsUserPanel(false);
                  }}
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};