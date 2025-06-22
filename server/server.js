const express = require("express");
const app = express();
const cors = require("cors");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const server = require("http").createServer(app);
const { Server } = require("socket.io");

// ✅ CORS for Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://white-sync-snowy.vercel.app", // your frontend
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Proper Express CORS
app.use(
  cors({
    origin: "https://white-sync-snowy.vercel.app",
    credentials: true,
  })
);

const port = process.env.PORT || 3000;

// ✅ Health check (for Render)
app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.get("/", (req, res) => {
  res.send("Hello, Tanishq Tyagi!");
});

let connections = [];
let currentRoomId = "";

io.on("connection", (socket) => {
  const socketId = socket.id;
  connections.push(socket);
  console.log(`${socketId} has connected.`);

  socket.on("userJoinedRoom", (data) => {
    const { name, roomId, userId, host, presenter } = data;
    currentRoomId = roomId;

    const users = addUser({ socketId, ...data });
    socket.join(roomId);

    console.log(`${userId} joined room ${roomId}`);
    io.sockets.in(roomId).emit("userIsJoined", { users });
    socket.to(roomId).emit("userJoinedRoom", {
      success: true,
      user: { socketId, ...data },
    });
  });

  socket.on("drawPencil", ({ path, strokeColor, roomId }) => {
    socket.to(roomId).emit("onDrawPencil", { path, strokeColor });
  });

  socket.on("drawLine", ({ path, strokeColor, roomId }) => {
    socket.to(roomId).emit("onDrawLine", {
      x1: path[0],
      y1: path[1],
      x2: path[2],
      y2: path[3],
      strokeColor,
    });
  });

  socket.on("drawRect", ({ path, strokeColor, roomId }) => {
    socket.to(roomId).emit("onDrawRect", {
      x1: path[0],
      y1: path[1],
      x2: path[2],
      y2: path[3],
      strokeColor,
    });
  });

  socket.on("erase", ({ path, roomId }) => {
    socket.to(roomId).emit("onErase", {
      x1: path[0],
      y1: path[1],
      x2: path[2],
      y2: path[3],
    });
  });

  socket.on("message", ({ message, roomId }) => {
    const user = getUser(socketId);
    if (user) {
      socket.to(roomId).emit("onMessage", { message, name: user.name });
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socketId} is disconnected`);
    const user = getUser(socketId);
    if (user) {
      socket.to(currentRoomId).emit("onDisconnect", {
        name: user.name,
        socketId: user.socketId,
      });
      removeUser(socketId);
    }
    connections = connections.filter((con) => con.id !== socket.id);
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(500).json({
    msg: "Server error: " + err.message,
  });
});

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});
