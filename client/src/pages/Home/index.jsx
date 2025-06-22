/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";

//icons and images
export const Home = () => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/form`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-violet-500/10 rotate-45 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/5 w-16 h-16 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-lg animate-ping"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-indigo-500/10 rounded-lg rotate-12 animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="mx-auto h-full px-4 py-20 md:py-36 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* Main Content */}
            <div className="max-w-4xl">
              <div className="mb-8">
                <p className="flex items-center justify-center text-sm uppercase text-purple-300 mb-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 inline h-5 w-5 text-violet-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  An open source project that makes your life easier
                </p>
                
                <h1 className="mb-8 text-6xl md:text-8xl lg:text-9xl font-light leading-tight tracking-tight text-white">
                  Web whiteboard for
                  <br />
                  <span className="inline-block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent font-bold mt-4">
                    instant
                  </span>
                  <br />
                  <span className="text-gray-300">collaboration</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Create, collaborate, and communicate in real-time. Draw your ideas, 
                  chat with your team, and bring your projects to life.
                </p>
              </div>
              
              {/* CTA Button */}
              <div className="flex justify-center">
                <Link
                  to={"/form"}
                  className="group inline-flex items-center justify-center px-12 py-6 text-lg font-medium bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                >
                  Start whiteboarding
                  <MoveRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
              
              {/* Feature Highlights */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-8 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Infinite Canvas</h3>
                  <p className="text-gray-400 leading-relaxed">Draw without limits on an endless digital canvas that scales with your creativity.</p>
                </div>
                
                <div className="text-center p-8 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-violet-500/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Real-time Sync</h3>
                  <p className="text-gray-400 leading-relaxed">Collaborate instantly with your team. See changes in real-time as you work together.</p>
                </div>
                
                <div className="text-center p-8 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Integrated Chat</h3>
                  <p className="text-gray-400 leading-relaxed">Communicate seamlessly while you create with built-in real-time messaging.</p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="mt-20 flex items-center justify-center gap-12 text-center">
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">Launching Now</div>
                  <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Be Among the First</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">In Beta</div>
                  <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Building With You</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-600 to-transparent"></div>
                <div className="group">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">Creators Onboard</div>
                  <div className="text-gray-400 text-lg group-hover:text-gray-300 transition-colors">Sharing Ideas Live</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};