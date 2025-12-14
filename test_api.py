"""
This script demonstrates how to interact with the Rock–Paper–Scissors Tournament REST API. It follows the style used in the REST tutorial and issues requests to each endpoint in sequence.

Before running this file, make sure the Flask server is running:

    python app.py

"""

import requests

BASE_URL = "http://127.0.0.1:5000"


def print_section(title):
    print("\n" + "-" * 50)
    print(title)
    print("-" * 50)


# 1. Test registering two players
def test_register_players():
    print_section("TEST 1 — Register Players")

    payload = {
        "player1": "PalomarA",
        "player2": "PalomarB"
    }

    r = requests.post(f"{BASE_URL}/api/player/register", json=payload)

    print("Status Code:", r.status_code)
    print("Response:", r.json())


# 2. Test starting a new game session
def test_start_game():
    print_section("TEST 2 — Start New Game")

    payload = {
        "player1": "PalomarA",
        "player2": "PalomarB"
    }

    r = requests.post(f"{BASE_URL}/api/game/start", json=payload)

    print("Status Code:", r.status_code)
    print("Response:", r.json())


# 3. Test playing a single round
def test_play_round():
    print_section("TEST 3 — Play Round")

    payload = {
        "p1_choice": "rock",
        "p2_choice": "scissors"
    }

    r = requests.post(f"{BASE_URL}/api/game/play_round", json=payload)

    print("Status Code:", r.status_code)
    print("Response:", r.json())


# 4. Test retrieving the leaderboard
def test_leaderboard():
    print_section("TEST 4 — Leaderboard Output")

    r = requests.get(f"{BASE_URL}/api/leaderboard")

    print("Status Code:", r.status_code)
    print("Response:", r.json())


# Main execution sequence
if __name__ == "__main__":
    test_register_players()
    test_start_game()
    test_play_round()
    test_leaderboard()

    print("\n*** TESTING COMPLETE ***\n")