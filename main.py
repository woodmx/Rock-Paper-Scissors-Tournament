from flask import Flask, render_template, request, jsonify
import random

# Creates Flask application
app = Flask(__name__)

# Leaderboard dictionary
leaderboard = {}

# Active game state, resets every match
current_game = {
    "player1": None,
    "player2": None,
    "round": 0,
    "max_rounds": 10,
    "p1_round_wins": 0,
    "p2_round_wins": 0
}


# Creates a new player in leaderboard if not already present
def create_player(name: str):
    if name not in leaderboard:
        leaderboard[name] = {
            "score": 0,
            "games_won": 0
        }
    return leaderboard[name]


# Determines winner of a single round
def round_logic(p1_choice, p2_choice):
    if p1_choice == p2_choice:
        return "Tie"

    wins = {
        "rock": "scissors",
        "paper": "rock",
        "scissors": "paper"
    }

    if wins[p1_choice] == p2_choice:
        return "P1"
    else:
        return "P2"


# API routes renders main page
@app.route("/")
def home():
    return render_template("index.html")

# Register players for first game OR after a complete game
@app.route("/api/player/register", methods=["POST"])
def register_players():
    data = request.json
    p1 = data.get("player1")
    p2 = data.get("player2")

    if not p1 or not p2:
        return jsonify({"error": "Both player names are required"}), 400

    create_player(p1)
    create_player(p2)

    # Resets game rounds
    current_game["player1"] = p1
    current_game["player2"] = p2
    current_game["round"] = 0
    current_game["p1_round_wins"] = 0
    current_game["p2_round_wins"] = 0

    return jsonify({"message": "Players registered"}), 200


# Starts a new 10 round match
@app.route("/api/game/start", methods=["POST"])
def start_game():
    data = request.json
    p1 = data.get("player1")
    p2 = data.get("player2")

    if not p1 or not p2:
        return jsonify({"error": "Players missing"}), 400

    # Reset game rounds
    current_game["player1"] = p1
    current_game["player2"] = p2
    current_game["round"] = 0
    current_game["p1_round_wins"] = 0
    current_game["p2_round_wins"] = 0

    return jsonify({"message": "Game started"}), 200


# Plays one round of RPS
@app.route("/api/game/play_round", methods=["POST"])
def play_round():
    data = request.json
    p1_choice = data.get("p1_choice")
    p2_choice = data.get("p2_choice")

    # Safety check
    if not p1_choice or not p2_choice:
        return jsonify({"error": "Missing choices"}), 400

    # Evaluate round
    result = round_logic(p1_choice, p2_choice)

    # Updates round wins for scoreboard
    if result == "P1":
        current_game["p1_round_wins"] += 1
    elif result == "P2":
        current_game["p2_round_wins"] += 1

    # Increase the round
    current_game["round"] += 1
    print("ROUND:", current_game["round"])  # DEBUG PRINT

    # Convert round result to actual name
    if result == "P1":
        last_round_winner = current_game["player1"]
    elif result == "P2":
        last_round_winner = current_game["player2"]
    else:
        last_round_winner = "Tie"

    # Check if game should end
    game_over = current_game["round"] >= current_game["max_rounds"]
    winner = None

    if game_over:
        # Determine winner of the 10-round game
        if current_game["p1_round_wins"] > current_game["p2_round_wins"]:
            winner = current_game["player1"]
        elif current_game["p2_round_wins"] > current_game["p1_round_wins"]:
            winner = current_game["player2"]
        else:
            winner = "Tie"

        # Update leaderboard
        if winner != "Tie":
            leaderboard[winner]["games_won"] += 1
            leaderboard[winner]["score"] += 1

        current_game["player1"] = None
        current_game["player2"] = None

        # Reset rounds ONLY after sending response
        current_game["round"] = 0
        current_game["p1_round_wins"] = 0
        current_game["p2_round_wins"] = 0

        last_round_winner = (
            current_game["player1"] 
            if result == "P1"
            else current_game["player2"] 

            if result == "P2"
            else "Tie"
        )
    
        return jsonify({
            "result": last_round_winner,
            "round": 10,
            "game_over": True,
            "winner": winner
        })

    winner_name = (
        current_game["player1"] 
            if result == "P1"
            else current_game["player2"]

            if result == "P2"
            else "Tie"
    )

    # Game continues
    return jsonify({
        "result": winner_name,
        "round": current_game["round"],
        "game_over": False,
        "winner": None
    })

# Leaderboard endpoint
@app.route("/api/leaderboard")
def get_leaderboard():
    # Converts dict to list so it can be sorted
    leaderboard_list = list(leaderboard.items())

    # Sort names alphabetically
    alphabetical = sorted(leaderboard_list, key=lambda x: x[0])
    # Sort names by highest score
    by_score = sorted(leaderboard_list, key=lambda x: x[1]["score"], reverse=True)

    return jsonify({
        "alphabetical": alphabetical,
        "by_score": by_score
    })


# Runs Flask server
if __name__ == "__main__":
    app.run(debug=True)