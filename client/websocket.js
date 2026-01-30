
// Create socket connection with server
const socket = io();

// Receive drawing data from other users
socket.on("draw", data => drawFromServer(data));

// Load complete canvas history (used for undo)
socket.on("load-history", history => redraw(history));

// Receive cursor positions from other users
socket.on("cursor", data => updateCursor(data));
