from tournament import Tournament
from player import *
from testing_player import *
from player import Player
from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient

#need to change this to the mongodb with fastapi
tournaments = []


#redact it and update it 
def add_players():
    # Create players for the tournament
    players = []
    for i in dummies:
        players.append(i)
    return players


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
    # Create players for the tournament
    # fix this part
    players = dummies[:]
    tournament.set_Players(players)
    print([p.get_displayname() for p in players])
    tournament.createMatches()
    print()
    #This shows only the match object because it is in a list
    #print(tournament.get_Matches())
    print()
    tournaments.append(tournament)
    #This shows the match info from the __str__ method
    tournament.viewMatchesinTournament()
    #print("Reached end")
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


def main():
    selection = 69
    while(selection is not 0):
        selection = input("Select what would you like to do?\n" +
                 "1: Create a tournament\n" +
                 "2: View tournaments\n" +
                 "3: Add a player\n" +
                 "4: Delete a player\n" +
                 "5: Update player info\n" +
                 "0: Quit")

        if(selection ==1):
           create_tournament()
        elif(selection ==2):
            # view the tournaments ongoing and update them?
            print([tournament for tournament in tournaments])
        elif(selection ==3):
            #add a player
            #This should be for the database but idk if its created or how we can do it     
            name = input("Enter players name")
            display = input("Enter players displayname")
            player = Player(playername=playername,displayname=display)
            print(f"Player {player.get_displayname()} has been created!")
        elif(selection ==4):
            #Delete a player
        elif(selection ==5):
            #update player info
        else:
             break



if __name__ == "__main__":
    main()
