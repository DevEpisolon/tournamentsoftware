import player_database
from tournament import Tournament
from player import *
from player import Player
from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from player_database import *
import asyncio


def create_tournament():
    tournament_name = input("Enter a tournament name: ")
    slot_count = int(input("Enter a Max slot count: "))
    max_slot_per_match = 2
    tournament = Tournament(
        tournamentName=tournament_name,
        tournamentId=None,
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
        droppedPlayers=None
    )
    return tournament

def collect_players(tournament):
    players = []
    size = 8
    players_in_tournament = 0
    while(players_in_tournament < size):
        add_player = input("Enter your display name: ")
        #get player from database
        kk = player_database.get_player(add_player)
        players.append(add_player)
        players_in_tournament += 1
    tournament.set_Players(players)
    print([p.get_displayname() for p in players])

def play_tournament(tournament):

    tournament.createMatches()
    print()
    # This shows only the match object because it is in a list
    # print(tournament.get_Matches())
    # This shows the match info from the __str__ method
    tournament.viewMatchesinTournament()
    # print("Reached end")
    while (tournament.get_tournamentWinner() is None):
        mid = input("\nEnter Match ID you would like to view: ")
        if int(mid) == len(tournament.get_Matches()):
            print("---Final Match---\n")
        cm = tournament.get_MatchbyID(mid)
        print(cm)
        pid = ""
        while (pid != "1") and (pid != "2"):
            pid = input("Enter player id you would like to promote (1 or 2): ")
            if (pid != "1") and (pid != "2"):
                print("invalid player ID. Please try again")
        if int(mid) == len(tournament.get_Matches()):
            tournament.set_tournamentWinner(cm.get_players()[int(pid) - 1])
            print()

        else:
            cm.set_round_winner(tournament.get_Matches(), cm.get_players()[int(pid) - 1])
            tournament.viewMatchesinTournament()

    print(f"Tournament {tournament.tournamentName} has ended\n")
    print("---WINNER---")
    print(tournament.get_tournamentWinner())
    print("updating player info...\n")
    # update player info with match history
    print("Thank you for playing!!!")

def update_player_info():
   # i think we auto do it after every match we should probally store all the changes in an arraylist and publish at end of tournament?
    pass


def main():
    running = True
    while (running):
        running = int(input("Select what would you like to do?\n" +
                    "1: Create a tournament\n" +
                    "2: collect players for tournament\n" +
                    "3: View tournaments\n" +
                    "4: Update player info\n" +
                    "0: Quit\n"
                    "your choice: "))
        if (running == 1):
            current_tournament = create_tournament()
            print("\nEmpty tournament created\n")
        elif(running == 2):
            print("\nCollecting players for tournament\n")
            collect_players(current_tournament)
            print("\nplayers added to tournament\n")
        elif (running == 3):
            print("starting tournament...")
            play_tournament(current_tournament)
        elif (running == 4):
            update_player_info()
        elif (running == 0):
            running = False





if __name__ == "__main__":
    main()
