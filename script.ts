const colors: string[] = [
    "red", "blue", "green", "yellow",
    "purple", "orange", "cyan", "magenta"
];
let cardValues: string[] = [];
let gameBoard = document.getElementById("game-board") as HTMLElement;
let firstCard: HTMLElement | null = null;
let secondCard: HTMLElement | null = null;
let lockBoard = false;

let timeElapsed = 0;
let score = 0;
let playerTurn = 1;
let attempts = 0;

const scoreDisplay = document.getElementById("score") as HTMLElement;
const endGameDisplay = document.getElementById("end-game") as HTMLElement;
const playerTurnDisplay = document.getElementById("player-turn") as HTMLElement;
const difficultySelect = document.getElementById("difficulty") as HTMLSelectElement;

function shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
}

function createCards() {
    cardValues = generateCardValues();
    const shuffledValues = shuffle(cardValues);
    gameBoard.innerHTML = ""; // Efface les cartes précédentes

    shuffledValues.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute("data-value", value);
        card.style.backgroundColor = "lightgray"; // Couleur de base
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}

function generateCardValues(): string[] {
    const difficulty = difficultySelect.value;
    let pairs = 4; // Niveau facile par défaut

    if (difficulty === "medium") pairs = 6; // Niveau moyen
    else if (difficulty === "hard") pairs = 8; // Niveau difficile

    const selectedColors = colors.slice(0, pairs);
    return [...selectedColors, ...selectedColors]; // Crée des paires de couleurs
}

function flipCard(this: HTMLElement) {
    if (lockBoard || this === firstCard) return;

    this.style.backgroundColor = this.getAttribute("data-value")!; // Change la couleur au retour
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
    const isMatch = firstCard?.getAttribute("data-value") === secondCard?.getAttribute("data-value");
    if (isMatch) {
        increaseScore();
        disableCards();
    } else {
        unflipCards();
    }
}

function increaseScore() {
    score += 10; // 10 points pour chaque paire
    scoreDisplay.innerText = `Score : ${score}`;
    playerTurnDisplay.innerText = `Total Points: ${score} points`;
}

function disableCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function unflipCards() {
    setTimeout(() => {
        firstCard!.style.backgroundColor = "lightgray"; // Remet la couleur de base
        secondCard!.style.backgroundColor = "lightgray"; // Remet la couleur de base
        resetBoard();
    }, 1500);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    playerTurn = playerTurn === 1 ? 2 : 1; // Change de joueur
    playerTurnDisplay.innerText = `Joueur ${playerTurn}: ${score} points`;
}

function checkGameEnd(): boolean {
    const cards = document.querySelectorAll(".card");
    return Array.from(cards).every(card => card.classList.contains("flipped"));
}

// Affiche l'écran de fin de jeu
function showEndGameScreen() {
    endGameDisplay.innerText = `Fin du jeu! Temps écoulé : ${timeElapsed} secondes, Score final : ${score}`;
    endGameDisplay.style.display = "block";
}

// Recommencer le jeu
function resetGame() {
    score = 0;
    timeElapsed = 0;
    attempts = 0;
    scoreDisplay.innerText = `Score : ${score}`;
    endGameDisplay.style.display = "none"; // Cacher l'écran de fin de jeu
    createCards(); // Crée de nouvelles cartes
}

// Bouton pour recommencer
const resetButton = document.createElement("button");
resetButton.innerText = "Recommencer";
resetButton.addEventListener("click", resetGame);
document.body.appendChild(resetButton);

// Événement pour changer de difficulté
difficultySelect.addEventListener("change", () => {
    resetGame();
});

// Crée le jeu initial
createCards();
