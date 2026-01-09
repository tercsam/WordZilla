const dingSound = new Audio('Ding.mp3');
const eraseSound = new Audio('Erase.mp3');
const falseSound = new Audio('False.mp3');
const winSound = new Audio('Win.mp3'); // Ton son ASMR de victoire

// Fonction pour jouer un son de frappe aléatoire entre Write1 et Write6
function playRandomWriteSound() {
    const randomIndex = Math.floor(Math.random() * 6) + 1;
    const sound = new Audio(`Write${randomIndex}.mp3`);
    sound.play().catch(() => {});
}

const wordBank = [
    'chat', 'chien', 'maison', 'arbre', 'soleil', 'livre', 'eau', 'lune', 'fleur', 'porte',
    'pizza', 'pomme', 'banane', 'riz', 'glace', 'café', 'tigre', 'hibou', 'renard', 'panda', 'aigle',
    'rouge', 'bleu', 'vert', 'jaune', 'violet', 'noir', 'blanc', 'orange', 'rose', 'gris',
    'chaise', 'table', 'stylo', 'vélo', 'montre', 'lampe', 'clé', 'sac',
    'manger', 'courir', 'dormir', 'parler', 'lire', 'écrire', 'sauter', 'nager', 'jouer',
    'énigme', 'mirage', 'ruban', 'papier', 'lettre', 'encre', 'texte',
    'levier', 'poésie', 'roman', 'auteur', 'orage', 'plage', 'forêt', 'île', 'ciel',
    'étoile', 'ombre', 'nuage', 'vent', 'feu', 'neige', 'arc',
    'code', 'secret', 'indice', 'balle', 'filet', 'golf', 'voile', 'course',
    'piano', 'chant', 'accord', 'note', 'écran', 'souris', 'script',
    'voiture', 'camion', 'moto', 'bus', 'train', 'avion', 'bateau', 'frein',
    'verre', 'tasse', 'assiette', 'nappe', 'poêle', 'sapin', 'tulipe', 'lilas', 'lys',
    'comète', 'baleine', 'requin', 'dauphin', 'poisson', 'crabe', 'pieuvre', 'raie',
    'bague', 'chapeau', 'gant', 'thé', 'jus', 'lait', 'soda', 'vin',
    'fraise', 'cerise', 'raisin', 'kiwi', 'mangue', 'melon', 'burger', 'pâtes', 'salade', 'soupe', 'tarte', 'gâteau',
    'phrase', 'poème', 'titre', 'jouet', 'puzzle', 'cartes', 'dés', 'plateau', 'score'
];

let word = "";
let guessedWord = [];
let attempts = 10;
let usedLetters = [];
let score = 0;
let bestScore = localStorage.getItem('wordzilla_record') || 0;

const paper = document.getElementById('paper');
const wordDisplay = document.getElementById('word-display');
const attemptsDisplay = document.getElementById('attempts');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const messageDisplay = document.getElementById('message');
const usedLettersDisplay = document.getElementById('used-letters-list');
const guessInput = document.getElementById('guess-input');
const resultScreen = document.getElementById('result-screen');
const gameControls = document.getElementById('game-controls');

function initGame() {
    paper.classList.add('carriage-return');
    wordDisplay.style.color = "#000"; 
    guessInput.disabled = false;
    
    dingSound.currentTime = 0;
    dingSound.play().catch(() => {});

    setTimeout(() => {
        word = wordBank[Math.floor(Math.random() * wordBank.length)].toLowerCase();
        guessedWord = Array(word.length).fill('_');
        attempts = 10;
        usedLetters = [];
        
        updateDisplay();
        messageDisplay.textContent = "";
        resultScreen.classList.add('hidden');
        gameControls.classList.remove('hidden');
        guessInput.value = "";
        
        paper.classList.remove('carriage-return');
        paper.classList.add('paper-in');
        guessInput.focus();

        setTimeout(() => paper.classList.remove('paper-in'), 800);
    }, 600);
}

function updateDisplay() {
    wordDisplay.textContent = guessedWord.join(' ');
    attemptsDisplay.textContent = attempts;
    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
    usedLettersDisplay.textContent = usedLetters.length > 0 ? usedLetters.join(' ') : "-";
}

document.addEventListener('click', () => {
    if(!guessInput.disabled) guessInput.focus();
});

guessInput.addEventListener('input', (e) => {
    const char = e.target.value.toLowerCase();
    guessInput.value = ""; 

    if (!char.match(/[a-zà-ÿ]/i) || usedLetters.includes(char)) return;

    usedLetters.push(char);

    if (word.includes(char)) {
        // Bonne lettre
        playRandomWriteSound();
        for (let i = 0; i < word.length; i++) {
            if (word[i] === char) guessedWord[i] = char;
        }
        showMessage("CLAC !", "black");
    } else {
        // Mauvaise lettre (Tampon)
        attempts--;
        const stampSound = falseSound.cloneNode();
        stampSound.volume = 0.8;
        stampSound.play().catch(() => {});
        showMessage("BIP...", "var(--error-color)");
    }

    // Effet visuel de frappe
    paper.classList.remove('hit');
    void paper.offsetWidth; 
    paper.classList.add('hit');

    updateDisplay();
    checkWinLoss();
});

function showMessage(txt, color) {
    messageDisplay.textContent = txt;
    messageDisplay.style.color = color;
}

function checkWinLoss() {
    if (!guessedWord.includes('_')) {
        // --- VICTOIRE ---
        winSound.currentTime = 0;
        winSound.play().catch(() => {});

        score++;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('wordzilla_record', bestScore);
        }
        showMessage(`PIÈCE FINIE : ${word.toUpperCase()}`, "var(--success-color)");
        endGame();
    } else if (attempts <= 0) {
        // --- DÉFAITE ---
        score = 0;
        triggerLoseAnimation();
    }
}

function triggerLoseAnimation() {
    guessInput.disabled = true; 
    showMessage("CORRECTION...", "var(--error-color)");

    let eraseInterval = setInterval(() => {
        if (guessedWord.length > 0) {
            guessedWord.pop();
            wordDisplay.textContent = guessedWord.join(' ');
            
            const clickErase = eraseSound.cloneNode();
            clickErase.volume = 0.6;
            clickErase.play().catch(() => {});
            
        } else {
            clearInterval(eraseInterval);
            setTimeout(typeCorrectWord, 500);
        }
    }, 120); 
}

function typeCorrectWord() {
    let i = 0;
    wordDisplay.style.color = "var(--error-color)";
    wordDisplay.textContent = "";

    let typeInterval = setInterval(() => {
        wordDisplay.textContent += (i === 0 ? "" : " ") + word[i].toUpperCase();
        playRandomWriteSound();

        paper.classList.remove('hit');
        void paper.offsetWidth;
        paper.classList.add('hit');

        i++;

        if (i === word.length) {
            clearInterval(typeInterval);
            setTimeout(endGame, 800);
        }
    }, 150);
}

function endGame() {
    gameControls.classList.add('hidden');
    resultScreen.classList.remove('hidden');
}

initGame();
