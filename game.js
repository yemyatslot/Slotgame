// === Slot Machine Game.js ===

// Slot symbols
const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

// Game state
let credits = 1000;
let bet = 10;
let autoSpinActive = false;

// DOM elements
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const reelsEls = document.querySelectorAll(".reel");
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");
const betPlusBtn = document.getElementById("betPlus");
const betMinusBtn = document.getElementById("betMinus");
const resultModal = document.getElementById("resultModal");
const resultText = document.getElementById("resultText");
const closeModalBtn = document.querySelector(".close");

// Update display
function updateUI() {
    creditsEl.textContent = credits;
    betEl.textContent = bet;
}

// Spin logic
function spin() {
    if (credits < bet) {
        showResult("Not enough credits!");
        autoSpinActive = false;
        return;
    }

    credits -= bet;

    let reelResults = [];
    reelsEls.forEach((reel, index) => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.textContent = symbol;
        reelResults.push(symbol);
    });

    // Check win
    if (reelResults.every(symbol => symbol === reelResults[0])) {
        const payout = bet * 10;
        credits += payout;
        showResult(`🎉 Jackpot! You win ${payout} credits! 🎉`);
    } else {
        showResult("❌ Try Again!");
    }

    updateUI();
}

// Auto Spin logic
function toggleAutoSpin() {
    autoSpinActive = !autoSpinActive;
    autoSpinBtn.textContent = autoSpinActive ? "Stop Auto Spin" : "Auto Spin";

    if (autoSpinActive) {
        autoSpin();
    }
}

function autoSpin() {
    if (!autoSpinActive) return;
    spin();
    setTimeout(autoSpin, 1000); // spin every second
}

// Result modal
function showResult(message) {
    resultText.textContent = message;
    resultModal.style.display = "block";
}

// Event listeners
spinBtn.addEventListener("click", spin);
autoSpinBtn.addEventListener("click", toggleAutoSpin);

betPlusBtn.addEventListener("click", () => {
    bet += 10;
    updateUI();
});

betMinusBtn.addEventListener("click", () => {
    if (bet > 10) bet -= 10;
    updateUI();
});

closeModalBtn.addEventListener("click", () => {
    resultModal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target == resultModal) {
        resultModal.style.display = "none";
    }
});

// Init
updateUI();
