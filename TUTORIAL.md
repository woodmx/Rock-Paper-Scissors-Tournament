# Rock Paper Scissors – Setup, Run, and Deployment Tutorial

This guide explains how **anyone cloning this repository** can set up, run, and deploy
the Rock Paper Scissors web application.

The application uses:
- Flask (Python backend)
- HTML / CSS / JavaScript (frontend)
- REST APIs for communication

---

## 1. Prerequisites

Make sure the following are installed:

- Python 3.9+
- Git
- A terminal:
  - PowerShell (Windows)
  - Bash (macOS / Linux)

Verify installations:

```bash
python --version
git --version
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/woodmx/Rock-Paper-Scissors-Tournament.git
cd Rock-Paper-Scissors-Tournament
```

---

## 3. (Optional) Create a Virtual Environment

### Windows (PowerShell)
```powershell
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux (Bash)
```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Install Dependencies

```bash
pip install flask
```

Or, if `requirements.txt` exists:

```bash
pip install -r requirements.txt
```

---

## 5. Project Structure

```
Rock-Paper-Scissors-Tournament/
│
├── main.py
├── static/
│   ├── main.js
│   ├── service.js
│   └── styles.css
│
├── templates/
│   └── index.html
|
├── README.md
├── QUICKSTART.md
└── TUTORIAL.md
```

---

## 6. Run the Application Locally

```bash
python main.py
```

If successful, Flask will display:

```
Running on http://127.0.0.1:5000
```

Open a browser and navigate to:

```
http://127.0.0.1:5000
```

---

## 7. How the App Works

- The frontend handles user interaction
- `service.js` manages API calls using `fetch()`
- Flask handles game logic and state
- Data is returned as JSON

---

## 8. Stop the Server

Press:

```
CTRL + C
```

---

## 9. Deployment Guide (For Anyone Cloning This Repo)

This section explains how **any user** can deploy their own live version.

---

## 9.1 Fork the Repository

1. Open the GitHub repo
2. Click **Fork**
3. Clone your fork locally

```bash
git clone https://github.com/YOUR-USERNAME/Rock-Paper-Scissors-Tournament.git
cd Rock-Paper-Scissors-Tournament
```

---

## 9.2 Create requirements.txt

If missing:

```bash
pip freeze > requirements.txt
```

Minimum content:

```
Flask
```

Commit and push:

```bash
git add requirements.txt
git commit -m "Add requirements.txt"
git push
```

---

## 9.3 Verify Flask Configuration

Ensure `main.py` contains:

```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

---

## 9.4 Deploy on Render

1. Go to https://render.com
2. Log in with GitHub
3. Click **New + → Web Service**
4. Select your forked repo

### Settings

| Setting | Value |
|-------|------|
| Environment | Python |
| Build Command | pip install -r requirements.txt |
| Start Command | python main.py |
| Instance Type | Free |

Click **Create Web Service**.

---

## 9.5 Access Live App

After deployment:

```
https://your-app-name.onrender.com
```

---

## 9.6 Redeploy Updates

```bash
git add .
git commit -m "Update app"
git push
```

Render redeploys automatically.

---

## 10. Common Issues

**App fails to start**
- Check Render logs
- Confirm Flask in requirements.txt

**UI not loading**
- Ensure `templates/index.html` exists
- Ensure `static/` folder exists

**App sleeping**
- Free tier apps sleep after inactivity

---

## 11. Summary

✔ Clone or fork repo  
✔ Install dependencies  
✔ Run locally  
✔ Deploy independently  
✔ Share live URL  

---

Author: Marcus Underwood
