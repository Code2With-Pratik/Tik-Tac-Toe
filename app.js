let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let currentPlayer = "O"; // Start with player O
let count = 0; // Tracks the number of moves

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Reset the game to its initial state
const resetGame = () => {
  currentPlayer = "O";
  count = 0;
  msgContainer.classList.add("hide");
  enableBoxes();
};

// Handle box clicks
const handleBoxClick = (box, index) => {
  if (box.innerText !== "") return; // Prevent overwriting moves

  box.innerText = currentPlayer;
  box.classList.add(currentPlayer === "O" ? "player-o" : "player-x"); // Add styles for players
  count++;

  // Check for winner or draw
  if (checkWinner()) {
    showWinner(currentPlayer);
    return;
  }

  if (count === 9) {
    gameDraw();
    return;
  }

  // Toggle player turn
  currentPlayer = currentPlayer === "O" ? "X" : "O";
};

// Add event listeners to boxes
boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleBoxClick(box, index));
});

// Handle game draw
const gameDraw = () => {
  msg.innerText = `It's a draw!`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Disable all boxes
const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

// Enable all boxes and reset their state
const enableBoxes = () => {
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.remove("player-o", "player-x");
  });
};

// Show winner message
const showWinner = (winner) => {
  msg.innerText = `Congratulations 🎉 Player ${winner} wins!`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Check for a winning pattern
const checkWinner = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boxes[a].innerText !== "" &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      return true;
    }
  }
  return false;
};

// Add event listeners to buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Initialize game
resetGame();
