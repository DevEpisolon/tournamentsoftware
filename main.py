from tournament import Tournament
from player import *
from testing_player import *


def add_players():
    # Create players for the tournament
    players = []
    for i in dummies:
        players.append(i)
    return players


def create_tournament():
    tournament_name = input("Enter a tournament name: ")
    slot_count = int(input("Enter a Max slot count: "))
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
    )
    players = add_players()
    print(players)

def main():
    create_tournament()
