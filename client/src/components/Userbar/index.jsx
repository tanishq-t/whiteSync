/* eslint-disable react/prop-types */
import "./index.css";

export const Userbar = (prop) => {
  const { usersInRoom, user, setIsChatBox, setIsUserPanel } = prop;
  console.log("Prop: " + prop);
  
  return (
    <div className="fixed bottom-24 right-4 h-[71%] w-80 z-50 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-2xl shadow-2xl backdrop-blur-lg flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="text-slate-200 font-semibold text-lg">People Online</h3>
        </div>
        
        <button
          className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
          onClick={() => {
            setIsUserPanel(false);
            setIsChatBox(false);
          }}
        >
          ×
        </button>
      </div>

      {/* User Count Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-3 border border-indigo-400/30">
          <p className="text-white text-center font-semibold flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            {usersInRoom.length} {usersInRoom.length === 1 ? 'Person' : 'People'} Connected
          </p>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="space-y-2">
          {usersInRoom.map((usr, index) => (
            <div 
              key={usr.userId || index}
              className={`p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                usr.userId === user.userId 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/30' 
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  usr.userId === user.userId 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
                }`}>
                  {usr.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {usr.name}
                      {usr.userId === user.userId && (
                        <span className="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {/* Online Status */}
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-xs opacity-75">Online</span>
                  </div>
                </div>

                {/* Admin Badge (if current user) */}
                {usr.userId === user.userId && (
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {usersInRoom.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No users online</p>
            <p className="text-slate-500 text-sm mt-1">Waiting for people to join...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 border-t border-slate-600">
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Real-time collaboration</span>
        </div>
      </div>
    </div>
  );
};