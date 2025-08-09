const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];
const reels = document.querySelectorAll(".reel .symbols");
const creditsEl = document.getElementById("credits");
const betEl = document.getElementById("bet");
const messageEl = document.getElementById("message");
const spinBtn = document.getElementById("spinBtn");
const autoSpinBtn = document.getElementById("autoSpinBtn");

let credits = 1000;
let bet = 10;
let autoSpin = false;

function updateUI() {
  creditsEl.textContent = credits;
  betEl.textContent = bet;
}

// Generate random symbols for each reel: 3 symbols vertically stacked
function generateReelSymbols() {
  const reelSymbolsArr = [];
  for (let i = 0; i < reels.length; i++) {
    let symbolsForReel = [];
    for (let j = 0; j < 3; j++) {
      symbolsForReel.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    reelSymbolsArr.push(symbolsForReel);
  }
  return reelSymbolsArr;
}

// Animate reels by changing transform: translateY
async function spin() {
  if (credits < bet) {
    showMessage("❌ Not enough credits!");
    stopAutoSpin();
    return;
  }

  credits -= bet;
  updateUI();
  showMessage("");

  const reelSymbolsArr = generateReelSymbols();

  // For each reel, build the symbols inside and animate spinning
  for (let i = 0; i < reels.length; i++) {
    const reelDiv = reels[i];
    reelDiv.style.transition = "none";
    // Build stacked symbols string (we add 3 extra symbols for smooth spin effect)
    // The order is: last 3 symbols + new 3 symbols
    const extendedSymbols = reelSymbolsArr[i].slice(-3).concat(reelSymbolsArr[i]);
    reelDiv.innerHTML = extendedSymbols.map(sym => `<div class="symbol">${sym}</div>`).join("");
    // Reset position to top (showing last 3 symbols)
    reelDiv.style.transform = `translateY(-240px)`;

    // Allow DOM update
    await new Promise(r => setTimeout(r, 50));

    // Animate down to show new symbols
    reelDiv.style.transition = "transform 1s cubic-bezier(0.33,1,0.68,1)";
    reelDiv.style.transform = "translateY(0)";
  }

  // Wait for animation to finish (approx 1s)
  await new Promise(r => setTimeout(r, 1200));

  // Check win condition (for simplicity, check middle row symbols match across reels)
  const middleSymbols = reelSymbolsArr.map(reel => reel[1]);
  const allSame = middleSymbols.every(sym => sym === middleSymbols[0]);

  if (allSame) {
    const payout = bet * 10;
    credits += payout;
    updateUI();
    showMessage(`🎉 JACKPOT! You won ${payout} credits! 🎉`);
  } else {
    showMessage("Try Again!");
  }
}

function showMessage(text) {
  messageEl.textContent = text;
}

function toggleAutoSpin() {
  autoSpin = !autoSpin;
  autoSpinBtn.textContent = autoSpin ? "Stop Auto Spin" : "Auto Spin: OFF";

  if (autoSpin) {
    autoSpinLoop();
  }
}

async function autoSpinLoop() {
  while (autoSpin) {
    await spin();
    await new Promise(r => setTimeout(r, 1500));
  }
}

function stopAutoSpin() {
  autoSpin = false;
  autoSpinBtn.textContent = "Auto Spin: OFF";
}

spinBtn.addEventListener("click", spin);
autoSpinBtn.addEventListener("click", toggleAutoSpin);

updateUI();
