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
    gameBoard.innerHTML = ""; // Efface les cartes précédentes
    shuffledValues.forEach(function (value) {
        var card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-value", value);
        card.style.backgroundColor = "lightgray"; // Couleur de base
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}
function generateCardValues() {
    var difficulty = difficultySelect.value;
    var pairs = 4; // Niveau facile par défaut
    if (difficulty === "medium")
        pairs = 6; // Niveau moyen
    else if (difficulty === "hard")
        pairs = 8; // Niveau difficile
    var selectedColors = colors.slice(0, pairs);
    return __spreadArray(__spreadArray([], selectedColors, true), selectedColors, true); // Crée des paires de couleurs
}
function flipCard() {
    if (lockBoard || this === firstCard)
        return;
    this.style.backgroundColor = this.getAttribute("data-value"); // Change la couleur au retour
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
    score += 10; // 10 points pour chaque paire
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
        firstCard.style.backgroundColor = "lightgray"; // Remet la couleur de base
        secondCard.style.backgroundColor = "lightgray"; // Remet la couleur de base
        resetBoard();
    }, 1500);
}
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    playerTurn = playerTurn === 1 ? 2 : 1; // Change de joueur
    playerTurnDisplay.innerText = "Joueur ".concat(playerTurn, ": ").concat(score, " points");
}
function checkGameEnd() {
    var cards = document.querySelectorAll(".card");
    return Array.from(cards).every(function (card) { return card.classList.contains("flipped"); });
}
// Affiche l'écran de fin de jeu
function showEndGameScreen() {
    endGameDisplay.innerText = "Fin du jeu! Temps \u00E9coul\u00E9 : ".concat(timeElapsed, " secondes, Score final : ").concat(score);
    endGameDisplay.style.display = "block";
}
// Recommencer le jeu
function resetGame() {
    score = 0;
    timeElapsed = 0;
    attempts = 0;
    scoreDisplay.innerText = "Score : ".concat(score);
    endGameDisplay.style.display = "none"; // Cacher l'écran de fin de jeu
    createCards(); // Crée de nouvelles cartes
}
// Bouton pour recommencer
var resetButton = document.createElement("button");
resetButton.innerText = "Recommencer";
resetButton.addEventListener("click", resetGame);
document.body.appendChild(resetButton);
// Événement pour changer de difficulté
difficultySelect.addEventListener("change", function () {
    resetGame();
});
// Crée le jeu initial
createCards();
