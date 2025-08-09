const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

function spin() {
    let reel1 = symbols[Math.floor(Math.random() * symbols.length)];
    let reel2 = symbols[Math.floor(Math.random() * symbols.length)];
    let reel3 = symbols[Math.floor(Math.random() * symbols.length)];

    document.getElementById("reels").textContent = `${reel1} ${reel2} ${reel3}`;

    if (reel1 === reel2 && reel2 === reel3) {
        document.getElementById("result").textContent = "🎉 Jackpot! You Win! 🎉";
    } else {
        document.getElementById("result").textContent = "❌ Try Again!";
    }
}
