// This imports API functions from service.js
import { 
    registerPlayersAPI,
    startGameAPI,
    playRoundAPI,
    getLeaderboardAPI 
} from "./service.js";

// Pagination and viewing state for both leaderboards
let alphaPage = 1;
let scorePage = 1;
const pageSize = 10;
let alphaData = [];
let scoreData = [];

// Stores player names, tracks current and max rounds 
let player1 = null;
let player2 = null;
let currentRound = 0;
const maxRounds = 10;

// Each players choice selection and turn
let player1Choice = null;
let player2Choice = null;
let turn = 1;


// Register event listeners AFTER DOM is loaded
document.addEventListener("DOMContentLoaded", () => {

    // Register button
    document.getElementById("registerBtn")
        .addEventListener("click", registerPlayers);

    // New Game button
    document.getElementById("newGameBtn")
        .addEventListener("click", newGame);

    // Start game button
    document.getElementById("startGameBtn")
        .addEventListener("click", startRound);

    // Rock, Paper, Scissors choice buttons
    document.querySelectorAll(".rps-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const choice = btn.dataset.choice;
        playRound(choice);
        });
    });

    // Pagination buttons for the Alphabetical leaderboard
    document.getElementById("alphaPrev").addEventListener("click", function () {
        if (alphaPage > 1) {
            alphaPage--;
            loadLeaderboard();
        }
    });

    document.getElementById("alphaNext").addEventListener("click", function () {
        if (alphaPage * pageSize < alphaData.length) {
            alphaPage++;
            loadLeaderboard();
        }
    });

    // Pagination buttons for the By Score leaderboard
    document.getElementById("scorePrev").addEventListener("click", function () {
        if (scorePage > 1) {
            scorePage--;
            loadLeaderboard();
        }
    });

    document.getElementById("scoreNext").addEventListener("click", function () {
        if (scorePage * pageSize < scoreData.length) {
            scorePage++;
            loadLeaderboard();
        }
    });

    // Renders the leaderboard immediately on page startup
    loadLeaderboard();
})


// Register both players
function registerPlayers() {
    const p1 = document.getElementById("player1Name").value.trim();
    const p2 = document.getElementById("player2Name").value.trim();

    // Validation that both names were entered
    if (!p1 || !p2) {
        alert("Enter both player names!");
        return;
    }

    // Send players name to backend
    registerPlayersAPI(p1, p2).then(() => {
        // Save players in game
        player1 = p1;
        player2 = p2;

        // Updates the UI 
        document.getElementById("player1Label").innerText = p1;
        document.getElementById("player2Label").innerText = p2;

        // Clears the input boxes
        document.getElementById("player1Name").value = "";
        document.getElementById("player2Name").value = "";

        // Resets game elements
        document.getElementById("gameOverBox").style.display = "none";
        document.getElementById("result").innerText = "";
        document.getElementById("player1Choice").innerText = "---";
        document.getElementById("player2Choice").innerText = "---";
        document.getElementById("roundDisplay").innerText = "Round: 0 / 10";

    currentRound = 0;
    turn = 1;

    // Enable RPS buttons
    disableRPSButtons(false);
    // Refreshes leaderboard
    loadLeaderboard();
    });
}


// Start a 10-round game
function startRound() {
    // Checks if players were registered
    if (!player1 || !player2) {
        alert("Register players first!");
        return;
    }
    // Lets backend know a new game is starting   
    startGameAPI(player1, player2).then(() => {

        currentRound = 1;
        turn = 1;

        document.getElementById("roundDisplay").innerText = 
            `Round: ${currentRound} / ${maxRounds}`;
        // Clears the displayed choices for new round
        document.getElementById("player1Choice").innerText = "";
        document.getElementById("player2Choice").innerText = "";
        // Initial status message, game has started
        document.getElementById("result").innerText = "Game started!";
        // Hides the "game over" message box
        document.getElementById("gameOverBox").style.display = "none";
    
    disableRPSButtons(false);

    // Hide New Game button again
    document.getElementById("startGameBtn").style.display = "none";
    });

    loadLeaderboard();
}   


// Plays one round of RPS
function playRound(choice) {
    // New round, clear last round results
    if (turn === 1) {
        document.getElementById("player1Choice").innerText = "---";
        document.getElementById("player2Choice").innerText = "---";
    }

    // Player 1's turn to make a choice
    if (turn === 1) {
        player1Choice = choice;
        document.getElementById("player1Choice").innerText = choice;
        // Switch to Player 2
        turn = 2;
        document.getElementById("result").innerText = player2 + "'s turn";
        return;
    }

    // Player 2's turn to make a choice
    if (turn === 2) {
        player2Choice = choice;
        document.getElementById("player2Choice").innerText = choice;
    }

    // Sends both choices to backend and get result
    playRoundAPI(player1Choice, player2Choice).then(data => {

        // Show round winner by name (backend now returns the name)
        document.getElementById("result").innerText =
            `Round Winner: ${data.result}`;
        loadLeaderboard();

        // Auto advance to next round (ONLY if not game-over)
        if (!data.game_over) {
            // Prevent double clicking
            disableRPSButtons(true);

            setTimeout(() => {
                disableRPSButtons(false);
                turn = 1;   // new round starts
            }, 900);
        }

        // Update round display if game is not over
        if (!data.game_over) {
            currentRound = data.round;
            document.getElementById("roundDisplay").innerText =
                `Round: ${currentRound} / ${maxRounds}`;
        }

        // GAME OVER — show notification box
        if (data.game_over) {

            const finalWinner = data.winner === "Tie"
                ? "It Was a Tie!"
                : `Winner: ${data.winner}`;

            // Show result box
            document.getElementById("gameWinnerText").innerText = finalWinner;
            document.getElementById("gameOverBox").style.display = "block";

            // Reset round display
            document.getElementById("roundDisplay").innerText =
                `Round: ${maxRounds} / ${maxRounds}`;

            // Disable game play until new players is entered
            disableRPSButtons(true);
            document.getElementById("player1Label").innerText = "Enter New Player";
            document.getElementById("player2Label").innerText = "Enter New Player";

            // New game button displays
            document.getElementById("newGameBtn").style.display = "inline-block";

            loadLeaderboard();
        }
    });
}


// Enable/disable all RPS buttons
function disableRPSButtons(state) {
    document.querySelectorAll(".rps-btn").forEach(btn => {
        btn.disabled = state;
    });
}


// Creates new game board
function newGame() {
    // Resets game state
    player1 = null;
    player2 = null;
    player1Choice = null;
    player2Choice = null;
    currentRound = 0;
    turn = 1;

    // Reset UI text
    document.getElementById("player1Label").innerText = "Player 1";
    document.getElementById("player2Label").innerText = "Player 2";

    document.getElementById("player1Choice").innerText = "---";
    document.getElementById("player2Choice").innerText = "---";

    document.getElementById("result").innerText = "";
    document.getElementById("roundDisplay").innerText = "Round: 0 / 10";

    // Hide "game over" pop-up
    document.getElementById("gameOverBox").style.display = "none";

    // Clear input boxes for new players can enter names
    document.getElementById("player1Name").value = "";
    document.getElementById("player2Name").value = "";

    // Disable RPS buttons until players register again
    disableRPSButtons(true);

    // Hide New Game button again
    document.getElementById("newGameBtn").style.display = "none";

    loadLeaderboard();
}


// Load and renders both leaderboard tables
function loadLeaderboard() {
    getLeaderboardAPI().then(function (data) {
        alphaData = data.alphabetical;
        scoreData = data.by_score;

        renderAlphaPage();
        renderScorePage();
    });
}


// Renders Alphabetical leaderboard with pagination
function renderAlphaPage() {
    const tbody = document.getElementById("leaderboardAlpha");
    tbody.innerHTML = "";

    // Determine which items belong to this page
    const start = (alphaPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = alphaData.slice(start, end);

    // Use a fragment for efficient DOM updates 
    const fragment = document.createDocumentFragment();

    // Build table rows for visible page
    pageItems.forEach((entry, index) => {
        const [name, stats] = entry;
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${name}</td>
            <td>${stats.score}</td>
        `;

        fragment.appendChild(tr);
    })

    // Add all rows at once
    tbody.appendChild(fragment);

    // Update page display
    document.getElementById("alphaPageDisplay").innerText =
        `Page ${alphaPage}`;
}


// Renders By Score leaderboard with pagination
function renderScorePage() {
    const tbody = document.getElementById("leaderboardScore");
    tbody.innerHTML = "";  

    // Determine which items belong to this page
    const start = (scorePage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = scoreData.slice(start, end);

    // Use a fragment for efficient DOM updates
    const fragment = document.createDocumentFragment();

    // Build table rows for the visible page
    pageItems.forEach((entry, index) => {
        const [name, stats] = entry;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${name}</td>
            <td>${stats.score}</td>
        `;

        fragment.appendChild(tr);
    });

    // Add all rows at once
    tbody.appendChild(fragment);

    // Update page display
    document.getElementById("scorePageDisplay").innerText =
        `Page ${scorePage}`;
}