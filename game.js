// === Slot Machine Game ===

// Symbols for the reels
const SYMBOLS = ["🍒", "🍋", "🍊", "⭐", "💎"];

// Game state
let credits = 1000;
let bet = 10;
let autoSpin = false;
let totalWins = 0;
let totalSpins = 0;

// DOM references
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const winsEl = document.getElementById("totalWins");
const spinsEl = document.getElementById("totalSpins");
const messageEl = document.getElementById("message");
const reels = [...document.querySelectorAll("#reels .symbols")];
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");
const betSelect = document.getElementById("betSelect");

// Sounds
const sSpin = document.getElementById("soundSpin");
const sStop = document.getElementById("soundReelStop");
const sWin = document.getElementById("soundWin");

// Update displayed values
function updateUI() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
  winsEl.textContent = totalWins;
  spinsEl.textContent = totalSpins;
}

// Show a temporary message
function showMessage(msg) {
  messageEl.textContent = msg;
}

// Generate 3 random symbols for a reel
function getReel() {
  return Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
}

// Main spin logic
async function spin() {
  if (credits < bet) {
    showMessage("❌ Not enough credits!");
    autoSpin = false;
    autoSpinBtn.textContent = "Auto Spin: OFF";
    return;
  }

  credits -= bet;
  totalSpins++;
  updateUI();
  showMessage("");

  // Play spin sound
  sSpin.currentTime = 0;
  sSpin.play();

  const result = reels.map(() => getReel());

  // Animate reels
  for (let i = 0; i < reels.length; i++) {
    const reelDiv = reels[i];
    const extended = [...result[i], ...getReel()];
    reelDiv.style.transition = "none";
    reelDiv.innerHTML = extended.map(s => `<div class="symbol">${s}</div>`).join("");
    reelDiv.style.transform = "translateY(-240px)";
    void reelDiv.offsetWidth; // trigger reflow
    reelDiv.style.transition = "transform 1s ease-out";
    reelDiv.style.transform = "translateY(-480px)";

    setTimeout(() => {
      sStop.currentTime = 0;
      sStop.play();
    }, i * 400);

    await new Promise(r => setTimeout(r, 1200));
  }

  // Check win (middle row)
  const middle = result.map(r => r[1]);
  if (middle.every(s => s === middle[0])) {
    const payout = bet * 10;
    credits += payout;
    totalWins += payout;
    updateUI();
    showMessage(`🎉 JACKPOT! Won ${payout} credits!`);
    sWin.currentTime = 0;
    sWin.play();
  } else {
    showMessage("Try again!");
  }
}

// Auto spin
async function autoSpinLoop() {
  while (autoSpin) {
    await spin();
    await new Promise(r => setTimeout(r, 1500));
  }
}

function toggleAutoSpin() {
  autoSpin = !autoSpin;
  autoSpinBtn.textContent = autoSpin ? "Stop Auto Spin" : "Auto Spin: OFF";
  if (autoSpin) autoSpinLoop();
}

// Bet change
betSelect.addEventListener("change", () => {
  bet = betSelect.value === "max" ? credits : parseInt(betSelect.value);
  updateUI();
});

// Events
spinBtn.addEventListener("click", spin);
autoSpinBtn.addEventListener("click", toggleAutoSpin);

// Init
updateUI();
