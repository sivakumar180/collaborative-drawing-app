
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const drawing = require("./drawing-state");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("client"));

// Generate random color for users
function randomColor() {
  return "#" + Math.floor(Math.random()*16777215).toString(16);
}

io.on("connection", socket => {
  const userColor = randomColor();

  // Send existing canvas history to new user
  socket.emit("load-history", drawing.getHistory());

  // Receive drawing data
  socket.on("draw", data => {
    drawing.addStroke(data);
    socket.broadcast.emit("draw", data);
  });

  // Global undo
  socket.on("undo", () => {
    drawing.undo();
    io.emit("load-history", drawing.getHistory());
  });

  // Cursor movement
  socket.on("cursor", pos => {
    socket.broadcast.emit("cursor", {
      id: socket.id,
      x: pos.x,
      y: pos.y,
      color: userColor
    });
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
