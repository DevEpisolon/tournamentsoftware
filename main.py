from tournament import Tournament
from player import Player
from testing_player import *


def add_players():
    # Create players for the tournament
    players = dummies[:]
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

def main():
    create_tournament()

# Adding players to the tournament
#for player in players:
#tournament.add_player(player)
    
#tournament.create_matches()
#tournament.viewMatchesinTournament(tournament)
