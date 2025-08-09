// === Slot Machine Game.js ===

// Slot symbols you want to use
const symbols = ["🍒", "🍋", "🍊", "💎"];

// Game state variables
let credits = 1000;
let bet = 10;
let autoSpinActive = false;

// DOM elements
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const reelsEls = document.querySelectorAll(".reel .symbols"); // 4 reels
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");
const messageEl = document.getElementById("message");

// Update UI with current credits and bet
function updateUI() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
}

// Show a temporary message below reels
function showMessage(text) {
  messageEl.textContent = text;
  setTimeout(() => {
    messageEl.textContent = "";
  }, 3000);
}

// Helper: generate random symbols array of length 3 for vertical reel
function getRandomSymbols() {
  const arr = [];
  for (let i = 0; i < 3; i++) {
    const randSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    arr.push(randSymbol);
  }
  return arr;
}

// Spin the slot reels with animation
function spin() {
  if (credits < bet) {
    showMessage("❌ Not enough credits!");
    autoSpinActive = false;
    autoSpinBtn.textContent = "Auto Spin: OFF";
    return;
  }

  credits -= bet;
  updateUI();

  // For each reel
  reelsEls.forEach((symbolsContainer, reelIndex) => {
    // Clear previous symbols
    symbolsContainer.innerHTML = "";

    // Generate 3 new symbols for vertical display
    const newSymbols = getRandomSymbols();

    // Create and append symbol elements stacked vertically
    newSymbols.forEach(sym => {
      const symEl = document.createElement("div");
      symEl.classList.add("symbol");
      symEl.textContent = sym;
      symbolsContainer.appendChild(symEl);
    });

    // Reset position to top (no transform)
    symbolsContainer.style.transform = "translateY(0)";

    // Animate spin: slide symbols up 1 full reel height (3 symbols × 80px)
    // You can tweak duration and easing in CSS transition
    setTimeout(() => {
      symbolsContainer.style.transition = "transform 1.2s cubic-bezier(0.33, 1, 0.68, 1)";
      symbolsContainer.style.transform = `translateY(-240px)`; // 3 symbols × 80px height each
    }, 50);

    // After animation, reset transition and position to show new symbols in place
    setTimeout(() => {
      symbolsContainer.style.transition = "none";
      symbolsContainer.style.transform = "translateY(0)";
    }, 1300);
  });

  // Simple win check: do all reels have same symbol in the middle row (index 1)?
  const middleSymbols = Array.from(reelsEls).map(reel => reel.children[1].textContent);
  if (middleSymbols.every(sym => sym === middleSymbols[0])) {
    const payout = bet * 10;
    credits += payout;
    showMessage(`🎉 Jackpot! You win ${payout} credits! 🎉`);
  } else {
    showMessage("❌ Try Again!");
  }

  updateUI();
}

// Auto Spin toggle
function toggleAutoSpin() {
  autoSpinActive = !autoSpinActive;
  autoSpinBtn.textContent = autoSpinActive ? "Stop Auto Spin" : "Auto Spin: OFF";

  if (autoSpinActive) {
    autoSpinLoop();
  }
}

function autoSpinLoop() {
  if (!autoSpinActive) return;
  spin();
  setTimeout(autoSpinLoop, 1500); // wait for spin animation + extra time
}

// Event Listeners
spinBtn.addEventListener("click", spin);
autoSpinBtn.addEventListener("click", toggleAutoSpin);

// Initialize UI on page load
updateUI();
