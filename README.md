# tournamentsoftware
team: TAS-32 project <br />

# TAS-32 Tournament Code Compilation Guide

<hr>

### 1. Frontend
- Pre-requisite:
  - Download [node.js](https://nodejs.org/en)
  - For clean installation run `rm -rf node_modules package-lock.json` from the terminal while in the frontend folder.
- Run `npm install` inside frontend folder to download all the dependency and setup the project.
- Run `npm start` to run our project.


### 2. Backend
- Pre-requisite:
  - Install [python](https://www.python.org/). For compatibility download version > 3.10.
  - In the backend folder of the project init a venv using `python3 -m venv .venv`
- Install all the required packages using `python3 install -r requirements.txt`. Make sure that there is requirements.txt file within the backend folder.
- In the backend folder run the following command to run the server: `python3 -m uvicorn fastapi_app:app --reload --host 0.0.0.0 --port 8000`
