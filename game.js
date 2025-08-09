// === Slot Machine Game.js ===

// Slot symbols for reels
const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

// Game state
let credits = 1000;
let bet = 10;
let autoSpinActive = false;
let totalWins = 0;
let totalSpins = 0;

// DOM elements
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const totalWinsEl = document.getElementById("totalWins");
const totalSpinsEl = document.getElementById("totalSpins");
const messageEl = document.getElementById("message");
const reels = [...document.querySelectorAll("#reels .symbols")];
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");
const betSelect = document.getElementById("betSelect");

const soundSpin = document.getElementById("soundSpin");
const soundReelStop = document.getElementById("soundReelStop");
const soundWin = document.getElementById("soundWin");

// Update UI info
function updateUI() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
  totalWinsEl.textContent = totalWins;
  totalSpinsEl.textContent = totalSpins;
}

// Show temporary message
function showMessage(text) {
  messageEl.textContent = text;
}

// Generate an array of 3 symbols for one reel
function generateReelSymbols() {
  let arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }
  return arr;
}

// Spin function with animation and sounds
async function spin() {
  if (credits < bet) {
    showMessage("❌ Not enough credits!");
    stopAutoSpin();
    return;
  }

  credits -= bet;
  totalSpins++;
  updateUI();
  showMessage("");

  soundSpin.currentTime = 0;
  soundSpin.play();

  // Generate symbols for each reel (3 symbols each)
  const reelsSymbolsArr = reels.map(() => generateReelSymbols());

  // Animate each reel sequentially
  for (let i = 0; i < reels.length; i++) {
    const reelDiv = reels[i];

    // Prepare symbols for animation (3 symbols + 3 extra to scroll)
    const extendedSymbols = [...reelsSymbolsArr[i], ...generateReelSymbols()];

    reelDiv.style.transition = "none";
    reelDiv.innerHTML = extendedSymbols.map(sym => `<div class="symbol">${sym}</div>`).join("");
    reelDiv.style.transform = `translateY(-240px)`; // start position to show middle symbols

    // Force reflow for transition to work
    void reelDiv.offsetWidth;

    // Animate to top (simulate spin)
    reelDiv.style.transition = "transform 1s cubic-bezier(0.33,1,0.68,1)";
    reelDiv.style.transform = "translateY(-480px)";

    // Play reel stop sound staggered
    setTimeout(() => {
      soundReelStop.currentTime = 0;
      soundReelStop.play();
    }, i * 400);

    // Wait for animation to finish before next reel
    await new Promise(r => setTimeout(r, 1200));
  }

  // Check win on middle row (index 1 of each reel)
  const middleSymbols = reelsSymbolsArr.map(arr => arr[1]);
  const allSame = middleSymbols.every(sym => sym === middleSymbols[0]);

  if (allSame) {
    const payout = bet * 10;
    credits += payout;
    totalWins += payout;
    updateUI();
    showMessage(`🎉 JACKPOT! You won ${payout} credits! 🎉`);

    soundWin.currentTime = 0;
    soundWin.play();
  } else {
    showMessage("Try Again!");
  }
}

// Auto spin control
function toggleAutoSpin() {
  autoSpinActive = !autoSpinActive;
  autoSpinBtn.textContent = autoSpinActive ? "Stop Auto Spin" : "Auto Spin: OFF";

  if (autoSpinActive) {
    autoSpinLoop();
  }
}

async function autoSpinLoop() {
  while (autoSpinActive) {
    await spin();
    await new Promise(r => setTimeout(r, 1500)); // delay between spins
  }
}

function stopAutoSpin() {
  autoSpinActive = false;
  autoSpinBtn.textContent = "Auto Spin: OFF";
}

// Event listeners
spinBtn.addEventListener("click", spin);
autoSpinBtn.addEventListener("click", toggleAutoSpin);

betSelect.addEventListener("change", () => {
  const val = betSelect.value;
  if (val === "max") {
    bet = credits;
  } else {
    bet = parseInt(val);
  }
  updateUI();
});

// Initialize UI
updateUI();
