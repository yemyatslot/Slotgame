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
const reelsEls = document.querySelectorAll(".reel .symbols"); // Fix: select .symbols inside each .reel
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");

// Since betPlus and betMinus buttons don't exist in your HTML, remove related code

// Add message area instead of modal (since modal missing in your HTML)
const messageEl = document.getElementById("message");

// Update display
function updateUI() {
    creditsEl.textContent = credits;
    betEl.textContent = bet;
}

// Show message
function showMessage(text) {
    messageEl.textContent = text;
    setTimeout(() => {
        messageEl.textContent = "";
    }, 3000); // clear message after 3 seconds
}

// Spin logic
function spin() {
    if (credits < bet) {
        showMessage("❌ Not enough credits!");
        autoSpinActive = false;
        autoSpinBtn.textContent = "Auto Spin: OFF";
        return;
    }

    credits -= bet;

    let reelResults = [];
    reelsEls.forEach((symbolsContainer) => {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        symbolsContainer.textContent = symbol;
        reelResults.push(symbol);
    });

    // Check win: all symbols same
    if (reelResults.every(symbol => symbol === reelResults[0])) {
        const payout = bet * 10;
        credits += payout;
        showMessage(`🎉 Jackpot! You win ${payout} credits! 🎉`);
    } else {
        showMessage("❌ Try Again!");
    }

    updateUI();
}

// Auto Spin logic
function toggleAutoSpin() {
    autoSpinActive = !autoSpinActive;
    autoSpinBtn.textContent = autoSpinActive ? "Stop Auto Spin" : "Auto Spin: OFF";

    if (autoSpinActive) {
        autoSpin();
    }
}

function autoSpin() {
    if (!autoSpinActive) return;
    spin();
    setTimeout(autoSpin, 1000); // spin every second
}

// Event listeners
spinBtn.addEventListener("click", spin);
autoSpinBtn.addEventListener("click", toggleAutoSpin);

// Init UI
updateUI();
