
// Tool controls
document.getElementById("colorPicker").onchange = e => {
  color = e.target.value;
};

document.getElementById("brush").onclick = () => tool = "brush";
document.getElementById("eraser").onclick = () => tool = "eraser";

// Undo button
document.getElementById("undo").onclick = () => {
  socket.emit("undo");
};

// Cursor indicator storage
const cursors = {};

// Update or create cursor indicator
function updateCursor(data) {
  if (!cursors[data.id]) {
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.style.background = data.color;
    document.body.appendChild(cursor);
    cursors[data.id] = cursor;
  }

  cursors[data.id].style.left = data.x + "px";
  cursors[data.id].style.top = data.y + "px";
}
