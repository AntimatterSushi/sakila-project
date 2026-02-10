# Sakila Video Store Project
This project uses:
- Flask (Python) for the backend
- React (Vite) for the frontend
- MySQL with the Sakila database

## Prerequisites
- Python 3
- Node.js (npm)
- MySQL Server
- Sakila database imported - https://dev.mysql.com/doc/index-other.html
- Done in VSCode

## Setup
Open a terminal in the project root (sakila-project).

## Terminal 1
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
$env:SAKILA_PASSWORD="your_mysql_root_password"
python app.py

## Terminal 2
cd frontend
npm install
npm run dev
