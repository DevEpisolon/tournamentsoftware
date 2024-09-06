# How to run
- Pre-requisite:
  - Install [python](https://www.python.org/). For compatibility download version > 3.10.
  - In the backend folder of the project init a venv using `python3 -m venv .venv`
- Install all the required packages using `python3 install -r requirements.txt`. Make sure that there is requirements.txt file within the backend folder.
- In the backend folder run the following command to run the server: `python3 -m uvicorn fastapi_app:app --reload --host 0.0.0.0 --port 8000`
# Backend main-
- main.py uses other files to generates an empty tournament using existing menu options.
- the main functions gives option to add players to the tournament once an empty tournament is created
- the admin can start tournament once players are collected
- the menu gives option to add, delete update tournment
- admin can choose to safely update player information (i.e. win/loss) after a tournament
# player_database.py
- Contains functions utilizing API calls required for the handling of players between backend to frontend.
# match_database.py
- Contains functions utilizing API calls required for the handling of matches in a tournament between backend to frontend.
# tournament.py
Contains functions utilizing API calls required for the handling of tournaments between backend to frontend.
# match.py
- Handles how matches are made and connected to each other. For example, the first round of a tournament going into the first match of round 2.
