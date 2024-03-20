from tournament import Tournament
from player import Player



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
players = []
#where i want to create my players for the tournament
for i in range(1, slot_count + 1):
    player_name = input(f"Enter name for Player {i}: ")
    players.append(createDummy(player_name,player_name + i,0,0,0))

# Adding players to the tournament
    for player in players:
        tournament.add_player(player)
    
tournament.create_matches()
tournament.viewMatchesinTournament(tournament)
