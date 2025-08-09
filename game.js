// === Slot Machine Game.js ===

// Slot symbols
const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

// Game state
let credits = 1000;
let bet = 10;
let autoSpinActive = false;

const symbolsPerReel = 10;       // total stacked symbols per reel for spinning
const visibleSymbolsCount = 3;   // how many symbols visible per reel (should match CSS reel height)

// DOM elements
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const reelsEls = document.querySelectorAll(".reel .symbols");
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");
const messageEl = document.getElementById("message");

// Populate each reel with stacked symbols for spinning
function populateReels() {
  reelsEls.forEach(symbolsContainer => {
    symbolsContainer.innerHTML = ""; // clear existing symbols

    for (let i = 0; i < symbolsPerReel; i++) {
      const symDiv = document.createElement("div");
      symDiv.classList.add("symbol");
      symDiv.textContent = symbols[i % symbols.length];
      symbolsContainer.appendChild(symDiv);
    }

    // Reset position
    symbolsContainer.style.transition = "none";
    symbolsContainer.style.transform = "translateY(0)";
  });
}

// Update UI display
function updateUI() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
}

// Show temporary message
function showMessage(text) {
  messageEl.textContent = text;
  setTimeout(() => {
    messageEl.textContent = "";
  }, 3000);
}

// Spin animation for one reel
function spinReel(reelIndex, finalSymbolIndex, duration = 3000) {
  return new Promise(resolve => {
    const symbolsContainer = reelsEls[reelIndex];
    const symbolHeight = symbolsContainer.querySelector(".symbol").offsetHeight;

    // Calculate final translateY position to show the final symbol at the top visible position
    const fullSpins = 3; // number of full spins before stopping
    const finalTranslateY = -((fullSpins * symbolsPerReel + finalSymbolIndex) * symbolHeight);

    // Start animation
    symbolsContainer.style.transition = `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)`;
    symbolsContainer.style.transform = `translateY(${finalTranslateY}px)`;

    // When transition ends, reset position to the final visible symbols without the extra full spins
    function onTransitionEnd() {
      symbolsContainer.style.transition = "none";

      // Normalize position (only finalSymbolIndex offset)
      const normalizedTranslateY = -(finalSymbolIndex * symbolHeight);
      symbolsContainer.style.transform = `translateY(${normalizedTranslateY}px)`;

      symbolsContainer.removeEventListener("transitionend", onTransitionEnd);
      resolve();
    }

    symbolsContainer.addEventListener("transitionend", onTransitionEnd);
  });
}

// Spin all reels with animation
async function spin() {
  if (credits < bet) {
    showMessage("❌ Not enough credits!");
    autoSpinActive = false;
    autoSpinBtn.textContent = "Auto Spin: OFF";
    return;
  }

  credits -= bet;
  updateUI();

  // Pick random final symbols for each reel
  const finalSymbols = [];
  for (let i = 0; i < reelsEls.length; i++) {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    finalSymbols.push(randomIndex);
  }

  // Spin reels sequentially with delay for nice effect
  for (let i = 0; i < reelsEls.length; i++) {
    await spinReel(i, finalSymbols[i], 3000 + i * 500); // longer duration for later reels
  }

  // Check if all symbols match for a jackpot
  const resultsSymbols = finalSymbols.map(i => symbols[i]);
  if (resultsSymbols.every(s => s === resultsSymbols[0])) {
    const payout = bet * 10;
    credits += payout;
    showMessage(`🎉 Jackpot! You win ${payout} credits! 🎉`);
  } else {
    showMessage("❌ Try Again!");
  }

  updateUI();
}

// Toggle auto spin
function toggleAutoSpin() {
  autoSpinActive = !autoSpinActive;
  autoSpinBtn.textContent = autoSpinActive ? "Stop Auto Spin" : "Auto Spin: OFF";

  if (autoSpinActive) {
    autoSpinLoop();
  }
}

// Auto spin loop
async function autoSpinLoop() {
  while (autoSpinActive) {
    await spin();
    await new Promise(r => setTimeout(r, 1000)); // wait 1 second between spins
  }
}

// Event listeners
spinBtn.addEventListener("click", () => {
  if (!autoSpinActive) spin();
});
autoSpinBtn.addEventListener("click", toggleAutoSpin);

// Initialize game
populateReels();
updateUI();
