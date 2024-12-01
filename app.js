let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let currentPlayer = "O"; // Start with player O
let count = 0; // Tracks the number of moves
let isComputerOpponent = false; // Set true for playing with a computer

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
  box.classList.add(currentPlayer === "O" ? "player-o" : "player-x");
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

  // Switch turn or let the computer play
  if (isComputerOpponent && currentPlayer === "X") {
    computerMove();
  } else {
    currentPlayer = currentPlayer === "O" ? "X" : "O";
  }
};

// Computer makes an optimal move using Minimax
const computerMove = () => {
  const bestMove = findBestMove();
  boxes[bestMove].innerText = "X";
  boxes[bestMove].classList.add("player-x");
  count++;

  // Check for winner or draw
  if (checkWinner()) {
    showWinner("X");
    return;
  }

  if (count === 9) {
    gameDraw();
    return;
  }

  currentPlayer = "O"; // Switch back to player O
};

// Minimax algorithm to determine the best move
const findBestMove = () => {
  let bestScore = -Infinity;
  let move = -1;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = "X"; // Simulate the computer's move
      let score = minimax(false); // Evaluate the board
      box.innerText = ""; // Undo the move

      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
};

const minimax = (isMaximizing) => {
  if (checkWinner(true)) return currentPlayer === "X" ? 1 : -1;
  if (count === 9) return 0; // Draw

  let bestScore = isMaximizing ? -Infinity : Infinity;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = isMaximizing ? "X" : "O"; // Simulate the move
      let score = minimax(!isMaximizing);
      box.innerText = ""; // Undo the move

      bestScore = isMaximizing
        ? Math.max(score, bestScore)
        : Math.min(score, bestScore);
    }
  });

  return bestScore;
};

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
  msg.innerText = `🎉 Player ${winner} wins!`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Check for a winning pattern
const checkWinner = (isSimulation = false) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      boxes[a].innerText !== "" &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      if (!isSimulation) showWinner(boxes[a].innerText);
      return true;
    }
  }
  return false;
};

// Add event listeners to boxes
boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleBoxClick(box, index));
});

// Add event listeners to buttons
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", () => {
  isComputerOpponent = confirm("Play against the computer?");
  resetGame();
});

// Initialize game
resetGame();
