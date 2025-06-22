/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import "./index.css";
import { MessagesContext } from "../../context/Messages";
import { X, Send, MessageCircle } from "lucide-react";

export const ChatBox = (prop) => {
  const { socket, usersInRoom, user, setIsChatBox, setIsUserPanel } = prop;
  const [input, setInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);

  const roomId = user?.roomId;

  useEffect(() => {
    socket.on("onMessage", (data) => {
      setMessages((prevMsg) => [...prevMsg, data]);
    });
  }, [socket]); // bug: if you pass the message to the dependencies array it will rerender messages.length times

  const handleInput = (e) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
    if (input.trim() !== "") {
      socket.emit("message", { message: input, roomId });
      setMessages((prevMsg) => [...prevMsg, { message: input, name: "You" }]);
      setInput(""); // Clear input after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-[6rem] right-[1rem] h-[71%] w-[20rem] z-50 bg-white/95 backdrop-blur-lg flex flex-col border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <MessageCircle size={16} className="text-white" />
          </div>
          <h3 className="text-white font-semibold text-sm">Room Chat</h3>
        </div>
        <button
          className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 text-white hover:text-red-400"
          onClick={() => {
            setIsUserPanel(false);
            setIsChatBox(false);
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.name === "You" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-sm ${
                    msg.name === "You"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white/80 text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  <p className="text-xs font-medium opacity-70 mb-1">
                    {msg.name}
                  </p>
                  <p className="text-sm leading-relaxed break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet</p>
                <p className="text-xs">Start the conversation!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/50">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              placeholder="Type your message..."
              value={input}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              className="w-full min-h-[40px] max-h-[100px] p-3 pr-10 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
              rows="1"
            />
            <div className="absolute right-2 bottom-2">
              <div className="text-xs text-gray-400">
                {input.length > 0 && `${input.length}/500`}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleSubmit}
            disabled={!input.trim()}
          >
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 6px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};