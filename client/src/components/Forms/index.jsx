/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import CreateRoom from "./CreateRoomForm";
import JoinRoom from "./JoinRoomForm";
import { Outlet } from "react-router-dom";

const Form = ({ socket, setUser }) => {
  const [isJoinRoomForm, setIsJoinRoomForm] = useState(false);

  useEffect(() => {
    console.log("form page");
  }, []);

  return (
    <main className="flex justify-center min-h-screen w-screen items-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Left Side - Creative Visual */}
      <div className="h-full md:flex-1 md:justify-end items-center md:flex hidden relative">
        <div className="h-[500px] w-[50%] max-w-[500px] flex-1 relative flex z-10">
          <div className="h-full w-full relative overflow-hidden rounded-lg">
            {/* Geometric Pattern Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_51%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(-45deg,transparent_49%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_51%)]"></div>
              </div>
            </div>
            
            {/* Animated Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full border-4 ${isJoinRoomForm ? 'border-blue-400' : 'border-rose-400'} animate-spin-slow`}></div>
                <div className={`absolute top-4 left-4 w-24 h-24 rounded-full border-2 ${isJoinRoomForm ? 'border-blue-300' : 'border-rose-300'} animate-spin-reverse`}></div>
                <div className={`absolute top-8 left-8 w-16 h-16 rounded-full ${isJoinRoomForm ? 'bg-blue-400' : 'bg-rose-400'} opacity-20`}></div>
              </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-2 h-2 ${isJoinRoomForm ? 'bg-blue-400' : 'bg-rose-400'} rounded-full animate-float`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Color Overlay */}
            <div className={`absolute inset-0 ${isJoinRoomForm ? 'bg-blue-600' : 'bg-rose-600'} opacity-10 transition-all duration-500`}></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 w-full h-full flex justify-center md:justify-start items-center relative">
        {/* Mobile Background */}
        <div className="h-full w-full absolute top-0 left-0 -z-10 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-95"></div>
        </div>

        {/* Form Card */}
        <div className="flex-col min-h-[500px] min-w-[500px] max-w-[1000px] relative z-30 justify-center md:w-[50%] w-[90%] max-w-md p-8 items-center">
          {/* Glass Card Effect */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col h-full justify-center items-center text-white">
            {/* Logo and Title */}
            <div className="flex my-6 justify-center items-center">
              <div className="mr-3">
                {/* Custom WhiteSync Logo */}
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-300 rounded-lg flex items-center justify-center shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-800">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                WhiteSync
              </h2>
            </div>

            {/* Form Content */}
            {!isJoinRoomForm ? (
              <div className="w-full p-3 flex flex-col justify-center items-center md:items-start">
                <div className="flex flex-col justify-center items-start w-full">
                  <h1 className="font-bold text-3xl text-blue-400 mb-4">
                    Create room
                  </h1>
                  <CreateRoom socket={socket} setUser={setUser} />
                </div>
              </div>
            ) : (
              <div className="w-full p-3 flex flex-col justify-center items-center md:items-start">
                <div className="flex flex-col justify-center items-start w-full">
                  <h1 className="font-bold text-3xl text-rose-400 mb-4">
                    Join room
                  </h1>
                  <JoinRoom socket={socket} setUser={setUser} />
                </div>
              </div>
            )}

            {/* Toggle Links */}
            <div className="mt-6">
              {isJoinRoomForm ? (
                <div className="flex justify-center items-center gap-1 md:gap-2 text-sm">
                  <p className="text-gray-300">Want to create a room instead?</p>
                  <p
                    onClick={() => setIsJoinRoomForm(false)}
                    className="text-rose-400 select-none cursor-pointer font-semibold hover:text-rose-300 transition-colors duration-200 hover:underline"
                  >
                    create room
                  </p>
                </div>
              ) : (
                <div className="flex justify-center items-center gap-1 md:gap-2 text-sm">
                  <p className="text-gray-300">Have a room code already?</p>
                  <p
                    onClick={() => setIsJoinRoomForm(true)}
                    className="text-blue-400 cursor-pointer select-none font-semibold hover:text-blue-300 transition-colors duration-200 hover:underline"
                  >
                    join room
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Outlet />

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
};

export default Form;