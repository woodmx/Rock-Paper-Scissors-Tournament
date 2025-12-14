// Helper function to handle fetch safely
async function safelyFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);

        // If error occurs, return error code 400-500
        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // This parses JSON safely
        const data = await response.json().catch(() => {
            throw new Error("Invalid JSON returned from server");
        });

        return data;

    } catch (err) {
        console.error("Fetch error:", err.message);
        return { error: err.message }; 
    }
}


// All API calls for the Rock-Paper-Scissors application
export async function registerPlayersAPI(player1, player2) {
    const r = await fetch("/api/player/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1, player2 })
    });
    return await r.json();
}

export async function startGameAPI(player1, player2) {
    const r = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1, player2 })
    });
    return await r.json();
}

export async function playRoundAPI(p1_choice, p2_choice) {
    const r = await fetch("/api/game/play_round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p1_choice, p2_choice })
    });
    return await r.json();
}

export async function getLeaderboardAPI() {
    const r = await fetch("/api/leaderboard");
    return await r.json();
}