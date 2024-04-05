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
    tournament.createMatches()
    print()
    print()
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
    create_tournament()

if __name__ == "__main__":
    main()
