# How to run
### 1. Frontend
- Pre-requisite:
  - Download [node.js](https://nodejs.org/en)
  - For clean installation run `rm -rf node_modules package-lock.json` from the terminal while in the frontend folder.
- Run `npm install` inside frontend folder to download all the dependency and setup the project.
- Run `npm start` to run our project.
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
