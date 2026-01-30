const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const drawing = require("./drawing-state");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve frontend files
app.use(express.static("client"));

// Generate random color for users
function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

/*
  Socket.IO connection handler
  Server acts as the single source of truth
*/
io.on("connection", socket => {
  const userColor = randomColor();

  // Send existing canvas history to newly connected user
  socket.emit("load-history", drawing.getHistory());

  // Receive drawing data and broadcast to other users
  socket.on("draw", data => {
    drawing.addStroke(data);
    socket.broadcast.emit("draw", data);
  });

  // Global undo (removes last stroke for all users)
  socket.on("undo", () => {
    drawing.undo();
    io.emit("load-history", drawing.getHistory());
  });

  // Cursor movement broadcasting
  socket.on("cursor", pos => {
    socket.broadcast.emit("cursor", {
      id: socket.id,
      x: pos.x,
      y: pos.y,
      color: userColor
    });
  });
});

// IMPORTANT: Use Render's dynamic port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
