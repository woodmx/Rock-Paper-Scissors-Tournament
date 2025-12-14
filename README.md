# Rock–Paper–Scissors Tournament Webserver Tutorial

This README provides an overview of the Rock–Paper–Scissors web server project. It explains the project structure, core concepts, and how the RESTful API communicates with the web interface. This document complements the tutorial and quickstart guides included with the project.

---

## Project Structure

Below is the expected directory layout for the tutorial project:

rps_game/
│
├── app.py                # Main Flask application
├── requirements.txt      # Python dependencies
├── QUICKSTART.md         # Quick start guide
├── README.md             # Project documentation
├── TUTORIAL.md           # RESTful API tutorial
├── test_api.py           # API test script
│
├── templates/
│   └── index.html        # Browser interface
│
└── static/
    ├── style.css         # Stylesheet
    └── script.js         # Frontend JavaScript

Each part works together to form a complete REST-based web application.

---

## RESTful Design Overview

This project introduces REST architecture through a simple interactive game. The server exposes HTTP endpoints used by the browser’s JavaScript to drive gameplay.

REST Principles Used:
- Client–Server: Browser is the client; Flask is the server.
- Stateless: Each request contains all necessary information.
- Resources: Players and games are represented as resources.
- HTTP Methods: GET and POST are used to retrieve and update data.
- JSON: Server and client exchange JSON messages.

---

## Game Logic Summary

The server manages a multi-round Rock–Paper–Scissors game.

Core rules:
- A match consists of 10 rounds.
- The server evaluates each round and tracks winners.
- The leaderboard persists across multiple games.
- Player records are stored in a dictionary on the server.

---

## REST API Endpoints

### 1. Register Players
POST /api/player/register

Registers two players if they do not already exist.

Example JSON:
{
  "player1": "PalomarA",
  "player2": "PalomarB"
}

---

### 2. Start a Game
POST /api/game/start

Initializes the 10-round match.

Example JSON:
{
  "player1": "PalomarA",
  "player2": "PalomarB"
}

---

### 3. Play a Round
POST /api/game/play_round

Example JSON:
{
  "p1_choice": "rock",
  "p2_choice": "scissors"
}

Response includes:
- round winner
- current round number
- whether the game is over
- final winner after 10 rounds

---

### 4. Leaderboard
GET /api/leaderboard

Example response:
{
  "alphabetical": [
    ["PalomarA", { "score": 2, "games_won": 0 }],
    ["PalomarB", { "score": 3, "games_won": 1 }]
    ],
  "by_score": [
    ["PalomarB", { "score": 3 }],
    ["PalomarA", { "score": 2 }]
  ]
}

The browser uses this to render the leaderboard.

---

## Frontend Interaction

JavaScript in the browser is responsible for:
- Sending player names to register
- Sending move selections
- Updating UI elements
- Displaying round and game winners
- Refreshing the leaderboard

The frontend does not compute game logic; it displays what the server sends back.

---

## Key Technologies

- Flask: Backend web server
- HTML templates: UI structure
- JavaScript (Fetch API): Communication with backend
- CSS: Styling
- Python Requests: Testing the API

---

## Testing the API

Run the provided test script:

python test_api.py

This script sends example requests to:
- /api/player/register
- /api/game/start
- /api/game/play_round
- /api/leaderboard

Use it to verify correct server behavior.

---

## Learning Objectives

Through this project, you learn:
- How REST APIs work
- Designing and handling JSON endpoints
- Maintaining server-side state
- Connecting JavaScript to API routes
- Implementing multi-round game logic

---

## Conclusion

This project demonstrates the fundamentals of building a REST-driven Flask web application. It provides hands-on experience with backend routes, JSON APIs, frontend communication, and game state management through a Rock–Paper–Scissors game.
