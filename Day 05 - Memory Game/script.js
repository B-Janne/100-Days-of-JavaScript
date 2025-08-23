// ------- DOM -------
const gameBoard = document.querySelector(".game-board");
const boardSizeSelect = document.getElementById("board-size");
const restartBtn = document.getElementById("restart");

// ------- Config / Assets -------
const imageList = [
  "cake.png",
  "flower.png",
  "boat.png",
  "bouquet.png",
  "branch.png",
  "donuts.png",
  "frying-eggs.png",
  "gift.png",
  "game.png",
  "game2.png",
  "pie.png",
  "soup.png",
  "strings.png",
  "tree.png",
  "whale.png",
];

// ------- State -------
let firstPick = null;
let secondPick = null;
let lockBoard = false;
let matchedCount = 0;

let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

// Keep the active board's total card count once per build
let totalCardsOnBoard = 0;

// ------- Helpers -------

// Parse "RxC" (e.g., "3x4") once
function parseSize(value) {
  if (typeof value !== "string") value = String(value);
  const [rows, cols] = value.split("x").map(Number);
  return { rows, cols, total: rows * cols, pairs: (rows * cols) / 2 };
}

function shuffledPairsFor(pairsCount) {
  if (pairsCount % 1 !== 0) {
    console.error("Total cards must be even to form pairs.");
    return [];
  }

  // Ensure we have enough unique images; if not, cycle through the list
  const pool = [];
  while (pool.length < pairsCount) {
    pool.push(...imageList);
  }
  const selected = pool.slice(0, pairsCount);

  // Duplicate for pairs
  const cards = [...selected, ...selected];

  // Fisher–Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function resetTurn() {
  [firstPick, secondPick] = [null, null];
  lockBoard = false;
}

function handleFlip(cardEl, imageName) {
  if (lockBoard) return;
  if (cardEl.classList.contains("flipped")) return;

  cardEl.classList.add("flipped");

  if (!firstPick) {
    firstPick = { el: cardEl, name: imageName };
    // start timer when first move happens
    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }
    return;
  }

  // second pick
  secondPick = { el: cardEl, name: imageName };
  lockBoard = true;

  moves++;
  document.getElementById("moves").textContent = `Moves: ${moves}`;

  const isMatch = firstPick.name === secondPick.name;

  if (isMatch) {
    // keep flipped, mark matched
    firstPick.el.classList.add("matched");
    secondPick.el.classList.add("matched");
    matchedCount += 2;
    resetTurn();
    checkWin();
    return;
  }

  // not a match: flip both back after delay
  setTimeout(() => {
    firstPick.el.classList.remove("flipped");
    secondPick.el.classList.remove("flipped");
    resetTurn();
  }, 900);
}

function buildCard(imageName) {
  const card = document.createElement("div");
  card.className = "card";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-face card-front";
  front.textContent = "?";

  const back = document.createElement("div");
  back.className = "card-face card-back";

  const img = document.createElement("img");
  img.src = `images/${imageName}`;
  img.alt = imageName.replace(/\.\w+$/, "");
  // if image fails, show a subtle fallback outline
  img.addEventListener("error", () => {
    back.style.outline = "2px dashed #E4004B";
    back.title = `Missing: images/${imageName}`;
  });

  back.appendChild(img);
  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  // click handler
  card.addEventListener("click", () => handleFlip(card, imageName));
  return card;
}

function createBoard(sizeValue) {
  const { rows, cols, total, pairs } = parseSize(sizeValue);

  // reset state
  firstPick = null;
  secondPick = null;
  lockBoard = false;
  matchedCount = 0;
  totalCardsOnBoard = total; // single source of truth

  // layout
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  // data
  const cards = shuffledPairsFor(pairs);

  // render
  cards.forEach((imgName) => gameBoard.appendChild(buildCard(imgName)));
}

// ------- Events -------
boardSizeSelect?.addEventListener("change", () => {
  const sizeValue = boardSizeSelect.value; // keep as string e.g. "2x3"
  createBoard(sizeValue);
});

restartBtn?.addEventListener("click", restartGame);

// ------- Init -------
window.addEventListener("DOMContentLoaded", () => {
  const initialSize = boardSizeSelect?.value || "3x4"; // default
  createBoard(initialSize);
});
// --- Timer logic ---
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `Time: ${timer}s`;
  }, 1000);
}

// --- Stop timer when game is won ---
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function checkWin() {
  if (matchedCount === totalCardsOnBoard) {
    stopTimer();

    const winMessage = document.getElementById("win-message");
    if (winMessage) {
      winMessage.style.display = "flex";
      document.getElementById("final-moves").textContent = moves;
      document.getElementById("final-time").textContent = timer;
    }
  }
}

function restartGame() {
  const sizeValue = boardSizeSelect.value;

  // reset stats
  moves = 0;
  timer = 0;
  gameStarted = false;
  matchedCount = 0;
  clearInterval(timerInterval);
  document.getElementById("moves").textContent = `Moves: 0`;
  document.getElementById("timer").textContent = `Time: 0s`;

  // hide win message if visible
  const winMessage = document.getElementById("win-message");
  if (winMessage) winMessage.style.display = "none";

  // rebuild board
  createBoard(sizeValue);
}
