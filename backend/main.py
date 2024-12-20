from auth import verify_firebase_token
from typing import Union
from fastapi import FastAPI, Request, HTTPException
from objects.tournament import Tournament
from objects.player import *
from database.player_database import *
from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
import asyncio

import firebase_admin
from firebase_admin import credentials
cred = credentials.Certificate("./firebase_key.json")
firebase_admin.initialize_app(cred)

def create_tournament():
    tournament_name = input("Enter a tournament name: ")
    slot_count = 2
    max_rounds_per_match = 1
    tournament = Tournament(
        maxSlotsPerMatch= 2,
        tournamentName=tournament_name,
        STATUS=None,
        STARTDATE=None,
        ENDDATE=None,
        createdAt=None,
        updatedAt=None,
        MaxSlotsCount=slot_count,
        TournamentType=None,
        TeamBoolean=None,
        AllotedMatchTime=None,
        Players=None,
        tournamentWinner=None,
        droppedPlayers=None,
        max_rounds = max_rounds_per_match
    )
    return tournament

async def collect_players():
    players = []
    temp_players = []
    size = 8
    players_in_tournament = 0
    while(players_in_tournament < size):
        add_player = input("Enter your display name: ")
        #get player from database
        player_data = document_to_player(await get_player(add_player))
        if player_data:
            print("Player Found.")
            print(player_data)
            players.append(player_data.get_playername())
            temp_players.append(player_data)
            players_in_tournament += 1
            print(players)
        else:
            print("Player not found. Please try again.")
    return temp_players

def play_tournament(tournament):

    tournament.createMatches()
    # This shows the match info from the __str__ method
    tournament.viewMatchesinTournament()
    # print("Reached end")
    while (tournament.get_tournamentWinner() is None):
        mid = input("\nEnter Match ID you would like to view: ")
        if int(mid) == len(tournament.get_Matches()):
            print("---Final Match---\n")
        cm = tournament.get_MatchbyID(mid)
        while cm.get_match_status() == "completed":
            mid = input("\nEnter an uncompleted Match ID : ")
            cm = tournament.get_MatchbyID(mid)
        print(cm)
        while cm.match_winner is None:
            pid = ""
            while (pid != "1") and (pid != "2"):
                pid = input("Enter player id you would like to promote (1 or 2): ")
                if (pid != "1") and (pid != "2"):
                    print("invalid player ID. Please try again")

            if int(mid) == len(tournament.get_Matches()):
                cm.update_rounds(cm.get_players()[int(pid) - 1], tournament.matches)
                tournament.set_tournamentWinner(cm.get_players()[int(pid) - 1])
                print()

            else:
                cm.update_rounds(cm.get_players()[int(pid) - 1], tournament.matches)
        tournament.viewMatchesinTournament()

    print(f"Tournament {tournament.tournamentName} has ended\n")
    print("---WINNER---")
    print(tournament.get_tournamentWinner())
    print("updating player info...\n")
    # update player info with match history
    print("Thank you for playing!!!")

def update_player_info_after(tournament):
    # work in progress
    tournament.update_dict()
    for i in tournament.Players:
        print(i.displayname)
    update_tourney_results(tournament.wins_dict, tournament.losses_dict, tournament.ties_dict, tournament.Players)
    print("\nInfo Updated\n")

def update_player_info_sep():
    pass

async def main():
    running = True
    current_tournament = None
    while running:
        choice = int(input("Select what you would like to do?\n"
                           "1: Create a tournament\n"
                           "2: Collect players for tournament\n"
                           "3: Play tournament\n"
                           "4: Update player info (after tournament)\n"
                           "5: Create new Player\n"
                           "6: Update Player info(seperate) \n"
                           "7: Delete player\n"
                           "0: Quit\n"
                           "Your choice: "))
        if choice == 1:
            current_tournament = create_tournament()
            print("\nEmpty tournament created.\n")
        elif choice == 2:
            if current_tournament:
                print("\nCollecting players for tournament.\n")
                player_in_tournament = await collect_players()
                print("\nPlayers added to tournament.\n")
                current_tournament.Players = player_in_tournament
            else:
                print("\nError: No tournament created yet. Please create a tournament first.\n")
        elif choice == 3:
            if current_tournament:
                print("Starting tournament...\n")
                play_tournament(current_tournament)
            else:
                print("\nError: No tournament created yet. Please create a tournament first.\n")
        elif choice == 4:
            update_player_info_after(current_tournament)
        elif choice == 5:
            await register_player()
        elif choice == 6:
            update_player_info_sep()
        elif choice == 7:
            del_player = input("Enter player's display name: ")
            await delete_player(del_player)
            print("Player successfully deleted.\n")
        elif choice == 0:
            running = False

if __name__ == "__main__":
    asyncio.run(main())
