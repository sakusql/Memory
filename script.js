var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var colors = [
    "red", "blue", "green", "yellow",
    "purple", "orange", "cyan", "magenta"
];
var cardValues = [];
var gameBoard = document.getElementById("game-board");
var firstCard = null;
var secondCard = null;
var lockBoard = false;
var timeElapsed = 0;
var score = 0;
var playerTurn = 1;
var attempts = 0;
var scoreDisplay = document.getElementById("score");
var endGameDisplay = document.getElementById("end-game");
var playerTurnDisplay = document.getElementById("player-turn");
var difficultySelect = document.getElementById("difficulty");
function shuffle(array) {
    return array.sort(function () { return Math.random() - 0.5; });
}
function createCards() {
    cardValues = generateCardValues();
    var shuffledValues = shuffle(cardValues);
    gameBoard.innerHTML = "";
    shuffledValues.forEach(function (value) {
        var card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-value", value);
        card.style.backgroundColor = "lightgray";
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}
function generateCardValues() {
    var difficulty = difficultySelect.value;
    var pairs = 4;
    if (difficulty === "medium") pairs = 6;
    else if (difficulty === "hard") pairs = 8;
    var selectedColors = colors.slice(0, pairs);
    return __spreadArray(__spreadArray([], selectedColors, true), selectedColors, true);
}
function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.style.backgroundColor = this.getAttribute("data-value");
    this.classList.add("flipped");
    attempts++;
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkForMatch();
}
function checkForMatch() {
    var isMatch = (firstCard === null || firstCard === void 0 ? void 0 : firstCard.getAttribute("data-value")) === (secondCard === null || secondCard === void 0 ? void 0 : secondCard.getAttribute("data-value"));
    if (isMatch) {
        increaseScore();
        disableCards();
    }
    else {
        unflipCards();
    }
}
function increaseScore() {
    score += 10;
    scoreDisplay.innerText = "Score : ".concat(score);
    playerTurnDisplay.innerText = "Total Points: ".concat(score, " points");
}
function disableCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
function unflipCards() {
    setTimeout(function () {
        firstCard.style.backgroundColor = "lightgray";
        secondCard.style.backgroundColor = "lightgray";
        resetBoard();
    }, 1500);
}
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    playerTurn = playerTurn === 1 ? 2 : 1;
    playerTurnDisplay.innerText = "Joueur ".concat(playerTurn, ": ").concat(score, " points");
}
function checkGameEnd() {
    var cards = document.querySelectorAll(".card");
    return Array.from(cards).every(function (card) { return card.classList.contains("flipped"); });
}
function showEndGameScreen() {
    endGameDisplay.innerText = "Fin du jeu! Temps écoulé : ".concat(timeElapsed, " secondes, Score final : ").concat(score);
    endGameDisplay.style.display = "block";
}
function resetGame() {
    score = 0;
    timeElapsed = 0;
    attempts = 0;
    scoreDisplay.innerText = "Score : ".concat(score);
    endGameDisplay.style.display = "none";
    createCards();
}
var resetButton = document.createElement("button");
resetButton.innerText = "Recommencer";
resetButton.addEventListener("click", resetGame);
document.body.appendChild(resetButton);
difficultySelect.addEventListener("change", function () {
    resetGame();
});
createCards();
