
// Stores all drawing operations
let history = [];

function addStroke(stroke) {
  history.push(stroke);
}

function undo() {
  history.pop();
}

function getHistory() {
  return history;
}

module.exports = { addStroke, undo, getHistory };
