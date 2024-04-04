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
    tournament.set_Players(players)
    print([p.get_displayname() for p in players])
    tournament.createMatches()
    print()
    #This shows only the match object because it is in a list
    #print(tournament.get_Matches())
    print()
    #This shows the match info from the __str__ method
    tournament.viewMatchesinTournament()
    #print("Reached end")
    while(tournament.get_tournamentWinner()is  None):
        mid = input("\nEnter Match ID you would like to view: ")
        cm = tournament.get_MatchbyID(mid)
        print(cm)
        pid = input("Enter player id you would like to promote(1 or 2): ")
        cm.set_round_winner(tournament.get_Matches(),cm.get_players()[int(pid) - 1])
        print(cm.get_match_winner())
        print(f"\n {tournament.viewMatchesinTournament()}")
    print(f"Winner of tournament: {tournament.get_tournamentWinner()}")
def main():
    create_tournament()

if __name__ == "__main__":
    main()
