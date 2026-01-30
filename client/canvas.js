
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let tool = "brush";
let color = "#000";

// Start drawing
function startDraw(e) {
  drawing = true;
  draw(e);
}

// Stop drawing
function stopDraw() {
  drawing = false;
  ctx.beginPath();
}

// Draw on canvas
function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.strokeStyle = tool === "eraser" ? "#fff" : color;
  ctx.lineWidth = tool === "eraser" ? 20 : 4;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);

  // Send drawing data to server
  socket.emit("draw", { x, y, color, tool });
}

// Draw strokes received from server
function drawFromServer(data) {
  ctx.strokeStyle = data.tool === "eraser" ? "#fff" : data.color;
  ctx.lineWidth = data.tool === "eraser" ? 20 : 4;

  ctx.lineTo(data.x, data.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(data.x, data.y);
}

// Redraw entire canvas (used for undo)
function redraw(history) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  history.forEach(drawFromServer);
}

// Mouse events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mousemove", draw);

// Send cursor position to server
canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  socket.emit("cursor", {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  });
});
