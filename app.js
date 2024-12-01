let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let gameModeSelect = document.querySelector("#game-mode");

let currentPlayer = "O"; // Start with player O
let count = 0; // Tracks the number of moves
let isComputerOpponent = false; // Determines the game mode
let isFirstMove = true; // Tracks if it's the computer's first move

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

// Handle mode selection
gameModeSelect.addEventListener("change", () => {
  isComputerOpponent = gameModeSelect.value === "computer";
  resetGame();
});

// Reset the game to its initial state
const resetGame = () => {
  currentPlayer = "O";
  count = 0;
  isFirstMove = true;
  msgContainer.classList.add("hide");
  enableBoxes();
};

// Handle box clicks
const handleBoxClick = (box, index) => {
  if (box.innerText !== "" || (isComputerOpponent && currentPlayer === "X")) return;

  box.innerText = currentPlayer;
  box.classList.add(currentPlayer === "O" ? "player-o" : "player-x");
  count++;

  if (checkWinner()) {
    showWinner(currentPlayer);
    return;
  }

  if (count === 9) {
    gameDraw();
    return;
  }

  if (isComputerOpponent) {
    currentPlayer = "X"; // Switch to computer
    setTimeout(() => {
      computerMove(); // Delay computer's move
    }, 500); // Reduced response time
  } else {
    currentPlayer = currentPlayer === "O" ? "X" : "O";
  }
};

// Computer makes an optimal move that forces a draw
const computerMove = () => {
  let bestMove;
  if (isFirstMove) {
    bestMove = getRandomMove(); // Random move on the first turn
    isFirstMove = false;
  } else {
    bestMove = findBlockingMove(); // Block player's winning move
    if (bestMove === -1) {
      bestMove = findDrawMove(); // Find a move that leads to a draw
    }
  }

  boxes[bestMove].innerText = "X";
  boxes[bestMove].classList.add("player-x");
  count++;

  if (checkWinner()) {
    showWinner("X");
    return;
  }

  if (count === 9) {
    gameDraw();
    return;
  }

  currentPlayer = "O"; // Switch back to player
};

// Get a random move for the computer on its first turn
const getRandomMove = () => {
  let availableMoves = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      availableMoves.push(index);
    }
  });

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Find blocking move to prevent the user from winning
const findBlockingMove = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    let emptyIndex = values.indexOf("");
    if (emptyIndex !== -1) {
      let countX = values.filter(val => val === "X").length;
      let countO = values.filter(val => val === "O").length;
      if (countX === 2 && countO === 0) {
        // Block the player from winning
        return pattern[emptyIndex];
      }
    }
  }
  return -1; // No blocking move needed
};

// Find a move that leads to a draw (if no blocking move is needed)
const findDrawMove = () => {
  let availableMoves = [];
  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      availableMoves.push(index);
    }
  });

  // If it's impossible for the player to win, select any available move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Check if there is an immediate winning move for the player
const checkPlayerWinningMove = () => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
    let emptyIndex = values.indexOf("");
    if (emptyIndex !== -1) {
      let countO = values.filter(val => val === "O").length;
      if (countO === 2 && values.filter(val => val !== "").length === 2) {
        return pattern[emptyIndex]; // Player has a winning move
      }
    }
  }
  return -1; // No winning move found
};

// Minimax with Alpha-Beta Pruning
const findBestMove = () => {
  let bestScore = -Infinity;
  let move = -1;

  boxes.forEach((box, index) => {
    if (box.innerText === "") {
      box.innerText = "X"; // Simulate computer's move
      let score = minimax(false, -Infinity, Infinity, 0); // Evaluate the board
      box.innerText = ""; // Undo move
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });

  return move;
};

// Minimax algorithm with Alpha-Beta Pruning to evaluate the board state
const minimax = (isMaximizing, alpha, beta, depth) => {
  // Check for terminal states (win, loss, or draw)
  if (checkWinner(true)) return currentPlayer === "X" ? 10 - depth : depth - 10;
  if (count === 9) return 0; // Draw

  let bestScore = isMaximizing ? -Infinity : Infinity;

  boxes.forEach((box) => {
    if (box.innerText === "") {
      box.innerText = isMaximizing ? "X" : "O"; // Simulate move
      let score = minimax(!isMaximizing, alpha, beta, depth + 1);
      box.innerText = ""; // Undo move

      if (isMaximizing) {
        bestScore = Math.max(score, bestScore);
        alpha = Math.max(alpha, bestScore);
      } else {
        bestScore = Math.min(score, bestScore);
        beta = Math.min(beta, bestScore);
      }

      if (beta <= alpha) {
        return; // Alpha-Beta Pruning
      }
    }
  });

  return bestScore;
};

// Handle game draw
const gameDraw = () => {
  msg.innerText = "It's a draw!";
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
resetBtn.addEventListener("click", resetGame);

// Initialize the game
resetGame();
