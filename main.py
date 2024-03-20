from tournament import Tournament
from player import Player
from testing_player import dummies


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
players = dummies[:]

# Adding players to the tournament
    for player in players:
        tournament.add_player(player)
    
tournament.create_matches()
tournament.viewMatchesinTournament(tournament)
