from datetime import datetime
import math
from objects.match import Match


class Tournament:
    def __init__(
        self,
        tournamentName,
        STATUS,
        STARTDATE,
        ENDDATE,
        createdAt,
        updatedAt,
        max_rounds,
        maxSlotsPerMatch,
        MaxSlotsCount,
        join_code,
        matches=None,
        TournamentType=None,
        TeamBoolean=None,
        AllotedMatchTime=None,
        Players=None,
        tournamentWinner=None,
        droppedPlayers=None,
        wins_dict=None,
        losses_dict=None,
        ties_dict=None,
        rounds=None,
        currentRound=None,
        onGoingPlayers=None,
    ):

        self.tournamentName = tournamentName
        self.STATUS = STATUS
        self.STARTDATE = STARTDATE
        self.ENDDATE = ENDDATE
        self.createdAt = (
            createdAt if createdAt else datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )
        self.updatedAt = updatedAt
        self.matches = matches if matches else []
        # overall slots in the whole tournament
        self.MaxSlotsCount = MaxSlotsCount
        self.TournamentType = TournamentType
        self.TeamBoolean = TeamBoolean
        self.AllotedMatchTime = AllotedMatchTime
        self.Players = Players if Players else []
        self.tournamentWinner = tournamentWinner
        self.droppedPlayers = droppedPlayers if droppedPlayers else []
        self.maxSlotsPerMatch = maxSlotsPerMatch if maxSlotsPerMatch else 2
        self.max_rounds = max_rounds
        self.wins_dict = wins_dict if wins_dict else {}
        self.losses_dict = losses_dict if losses_dict else {}
        self.ties_dict = ties_dict if ties_dict else {}
        # self.rounds = math.log2(len(Players) + 1)
        self.rounds = math.ceil(math.log2(len(Players))) if Players else 0
        self.currentRound = currentRound
        self.onGoingPlayers = Players if Players else []
        self.join_code = join_code

    # Getter and setter methods for each attribute
    def get_tournamentName(self):
        return self.tournamentName

    def set_tournamentName(self, tournamentName):
        self.tournamentName = tournamentName

    def get_STATUS(self):
        if self.STATUS == 0:
            return "In Progress"
        elif self.STATUS == 1:
            return "Not Started"
        elif self.STATUS == 2:
            return "Finished"

    # gets set from 0-2
    def set_STATUS(self, STATUS):
        self.STATUS = STATUS

    def get_STARTDATE(self):
        return self.STARTDATE

    def set_STARTDATE(self, STARTDATE):
        self.STARTDATE = STARTDATE

    def get_ENDDATE(self):
        return self.ENDDATE

    def set_ENDDATE(self, ENDDATE):
        self.ENDDATE = ENDDATE

    def get_createdAt(self):
        return self.createdAt

    def set_MaxSlotsPerMatch(self, count):
        self.maxSlotsPerMatch = count

    def get_currentRound(self):
        return self.currentRound

    def get_onGoingPlayers(self):
        return self.onGoingPlayers

    def set_onGoingPlayers(self, players):
        self.onGoingPlayers = players

    def set_currentRound(self, count):
        self.currentRound = count

    def get_MaxSlotsPerMatch(self):
        return self.maxSlotsPerMatch

    def set_createdAt(self, createdAt):
        self.createdAt = createdAt

    def get_updatedAt(self):
        return self.updatedAt

    def set_updatedAt(self, updatedAt):
        self.updatedAt = updatedAt

    def get_Matches(self):
        return self.matches

    def set_Matches(self, matches):
        self.matches = matches

    def get_MaxSlotsCount(self):
        return self.MaxSlotsCount

    def set_MaxSlotsCount(self, MaxSlotsCount):
        self.MaxSlotsCount = MaxSlotsCount

    def get_TournamentType(self):
        return self.TournamentType

    def set_TournamentType(self, TournamentType):
        self.TournamentType = TournamentType

    def get_TeamBoolean(self):
        return self.TeamBoolean

    def set_TeamBoolean(self, TeamBoolean):
        self.TeamBoolean = TeamBoolean

    def get_AllotedMatchTime(self):
        return self.AllotedMatchTime

    def set_AllotedMatchTime(self, AllotedMatchTime):
        self.AllotedMatchTime = AllotedMatchTime

    def get_Players(self):
        return self.Players

    def set_Players(self, Players):
        self.Players = Players

    def get_tournamentWinner(self):
        return self.tournamentWinner

    def set_tournamentWinner(self, Player):
        self.tournamentWinner = Player

    def set_rounds(self, rounds):
        self.rounds = rounds

    def get_rounds(self):
        return self.rounds

    # Functions
    """
    Add a singulaur player to the tournament
    player = player to add to tournament
    """

    def addPlayertoTournament(self, Player):
        self.Players.append(Player)

    """
    Checks to see if All matches in a certain round is finished
    """

    def allMatchesInRoundFinished(self, roundNumber):
        for x in self.getMatches:
            if (x.get_STATUS() != "Finished") and (x.get_currentRound() is roundNumber):
                return False
        return True

    def getMatchesinRound(self, roundNumber):
        tempMatches: List[Match] = []
        for x in self.getMatches():
            if x.get_currentRound() == roundNumber:
                tempMatches.append(x)
        return tempMatches

    def randomizePlayersinTournament(self):
        random.shuffle(self.getPlayers)

    def removePlayerfromTournament(self, Player):
        self.Players.remove(Player)
        self.droppedPlayers.append(Player)

    """
    To view the matches in the tournament
    tournament = tournament you would like to view
    """

    def viewMatchesinTournament(self):
        for x in self.get_Matches():
            print(f"{x}")

    """
    To get the int of the players in the tournament
    """

    def getPlayerCount(self):
        return len(self.Players)

    """
    To get a certian match in tournament
    matches is all the matches in tournament
    matchid is the match id
    """

    def get_MatchbyID(self, match_id):
        # print([m for m in self.get_Matches()])
        for match in self.get_Matches():
            # print(f"Current matchID: {match.get_matchid()} Finding: {match_id}")
            if int(match.get_matchid()) == int(match_id):
                return match
        return None

    """
    To create the matches in the tournaemnt
    Needs to be flexible based on tournamentType : Single Double Pairing
    Needs to create the necessary matches beforehand and route them like a web or a tree
    Need rounds so all the first matches finished then we can promote once everyone is finished
    Need async calls incase they close out the tournament and restart it so nothing is stored in allocated cache for recall memory
    Need to make less calls and just place the players without much checking/hardcoding


    """

    def createMatches(self):
        matches = []
        matchCount = self.getPlayerCount() - 1
        tempPlayers = self.get_Players().copy()
        # print(f"temp players: {tempPlayers}")
        count = 0
        nextCountID = self.getPlayerCount() / 2
        playersInMatch = []
        # print(f"Max slots count: {self.get_MaxSlotsCount()}")
        for i in range(1, matchCount + 1):
            # print(f"Count: {count}")
            count += 1

            # check count
            if count == 2:
                # print("Came through the 2 end")
                if len(tempPlayers) > 0:
                    for _ in range(self.get_MaxSlotsPerMatch()):
                        playersInMatch.append(tempPlayers.pop())
                    # print("The Players in the match")
                    # print([p.get_displayname() for p in playersInMatch])
                    m = Match(
                        matchid=i,
                        slots=self.get_MaxSlotsPerMatch(),
                        match_status=0,
                        max_rounds=self.max_rounds,
                        tournamentName=self.get_tournamentName(),
                        players=playersInMatch,
                        winner_next_match_id=nextCountID,
                        previous_match_id=None,
                        match_winner=None,
                        match_loser=None,
                        loser_next_match_id=None,
                        start_date=None,
                        end_date=None,
                        startTime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        endTime=None,
                    )
                    # print(m)
                else:
                    # print("Detected no players in 2 count")
                    m = Match(
                        matchid=i,
                        slots=self.get_MaxSlotsPerMatch(),
                        match_status=1,
                        max_rounds=self.max_rounds,
                        tournamentName=self.get_tournamentName(),
                        players=None,
                        winner_next_match_id=nextCountID,
                        previous_match_id=None,
                        match_winner=None,
                        match_loser=None,
                        loser_next_match_id=None,
                        start_date=None,
                        end_date=None,
                        startTime=None,
                        endTime=None,
                    )
                count = 0
            # Uneven count
            else:
                # print("Came through the other end!")
                if len(tempPlayers) > 0:
                    for _ in range(self.get_MaxSlotsPerMatch()):
                        playersInMatch.append(tempPlayers.pop())
                    # print("The players in the match")
                    # print([p.get_displayname() for p in playersInMatch])
                    m = Match(
                        matchid=i,
                        slots=self.get_MaxSlotsPerMatch(),
                        match_status=0,
                        max_rounds=self.max_rounds,
                        tournamentName=self.get_tournamentName(),
                        players=playersInMatch,
                        winner_next_match_id=nextCountID,
                        previous_match_id=None,
                        match_winner=None,
                        match_loser=None,
                        loser_next_match_id=None,
                        start_date=None,
                        end_date=None,
                        startTime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        endTime=None,
                    )
                    # print(m)
                else:
                    # print("Detected no players in other")
                    m = Match(
                        matchid=i,
                        slots=self.get_MaxSlotsPerMatch(),
                        match_status=1,
                        max_rounds=self.max_rounds,
                        tournamentName=self.get_tournamentName(),
                        players=None,
                        winner_next_match_id=nextCountID,
                        previous_match_id=None,
                        match_winner=None,
                        match_loser=None,
                        loser_next_match_id=None,
                        start_date=None,
                        end_date=None,
                        startTime=None,
                        endTime=None,
                    )
                nextCountID -= 1

            # Empty the players list to add other players
            playersInMatch = []
            matches.append(m)
        self.set_Matches(matches)

    """Updated create match function used with roundNumber so that we can promote users all at once"""

    def CreateMatches1(self):

        self.set_rounds(int(self.rounds))
        matchCount = self.getPlayerCount() - 1
        totalMatches = math.log2(len(self.Players))
        i = 0
        matches = []
        for x in range(self.get_rounds()):
            for _ in range(self.getPlayerCount() - 1):
                i += 1
                m = Match(
                    matchid=i,
                    slots=self.get_MaxSlotsPerMatch(),
                    match_status=1,
                    max_rounds=self.max_rounds,
                    tournamentName=self.get_tournamentName(),
                    players=None,
                    previous_match_id=None,
                    match_winner=None,
                    match_loser=None,
                    start_date=None,
                    end_date=None,
                    startTime=None,
                    endTime=None,
                    round_number=x + 1,
                    winner_next_match_id=None,
                )
                matches.append(m)

        self.set_Matches(matches)

    """
    Used to assign the players to the match 
    """

    def assignPlayersToMatches1(self):
        # Get the list of players and matches
        tempPlayers = self.get_Players().copy()

        # Filter matches for the first tournament round
        firstRoundMatches = [m for m in self.get_Matches() if m.get_round_number() == 1]

        # Iterate over first-round matches and assign players in pairs
        for match in firstRoundMatches:
            tempPlayersInMatch = []

            # Assign up to the max number of slots per match (default is 2 for a pair)
            for _ in range(self.get_MaxSlotsPerMatch()):
                if tempPlayers:  # Ensure there are players left to assign
                    tempPlayersInMatch.append(tempPlayers.pop())

            # Set players for the current match
            match.set_players(tempPlayersInMatch)


    """
    promotes the players in the decided round number to the next set of Matches
    rn = round number
    """

    def promotePlayersInrroundNumber1(self, rn):
        playerHolder = []
        if self.allMatchesInRoundFinished(rn):
            for x in self.getMatchesinRound(rn):
                playerHolder.append(x.get_round_winner())
        for y in self.getMatchesinRound(rn + 1):
            if len(playerHolder) >= 2:
                playersFornextMatch = [playerHolder.pop(0), playerHolder.pop(1)]
                y.set_players(playersFornextMatch)

    # call it when tournament ended so it can fetch players' wins, losses, and ties
    def update_dict(self):
        for match in self.get_Matches():
            for player in match.get_players():
                if match.round_wins.get(player.displayname) is not None:
                    self.wins_dict[player.displayname] = self.wins_dict.get(
                        player.displayname, 0
                    ) + match.round_wins.get(player.displayname)
                if match.round_losses.get(player.displayname) is not None:
                    self.losses_dict[player.displayname] = self.losses_dict.get(
                        player.displayname, 0
                    ) + match.round_losses.get(player.displayname)
                if match.round_ties.get(player.displayname) is not None:
                    self.ties_dict[player.displayname] = self.ties_dict.get(
                        player.displayname, 0
                    ) + match.round_ties.get(player.displayname)

    # Helper function to print tournament details
    def print_details(self):
        print("Tournament Name:", self.tournamentName)
        print("Status:", self.STATUS)
        print("Start Date:", self.STARTDATE)
        print("End Date:", self.ENDDATE)
        print("Created At:", self.createdAt)
        print("Updated At:", self.updatedAt)
        print("Matches:", self.matches)
        print("Max Slots Count:", self.MaxSlotsCount)
        print("Tournament Type:", self.TournamentType)
        print("Team Boolean:", self.TeamBoolean)
        print("Alloted Match Time:", self.AllotedMatchTime)
        print("Players:", self.Players)

    def _to_dict(self):
        return {
            "tournamentName": self.tournamentName,
            "STATUS": self.STATUS,
            "STARTDATE": self.STARTDATE,
            "ENDDATE": self.ENDDATE,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            "matches": [
                match.__to_dict() for match in self.matches
            ],  # Assuming Match class has __to_dict method
            "MaxSlotsCount": self.MaxSlotsCount,
            "TournamentType": self.TournamentType,
            "TeamBoolean": self.TeamBoolean,
            "AllotedMatchTime": self.AllotedMatchTime,
            "Players": [
                player.__to_dict() for player in self.Players
            ],  # Assuming Player class has __to_dict method
            "tournamentWinner": (
                self.tournamentWinner.__to_dict() if self.tournamentWinner else None
            ),  # Assuming Player class
            "droppedPlayers": [
                player.__to_dict() for player in self.droppedPlayers
            ],  # Assuming Player class
            "maxSlotsPerMatch": self.maxSlotsPerMatch,
            "max_rounds": self.max_rounds,
            "wins_dict": self.wins_dict,
            "losses_dict": self.losses_dict,
            "ties_dict": self.ties_dict,
            "rounds": self.rounds,
            "currentRound": self.currentRound,
            "onGoingPlayers": [
                player.__to_dict() for player in self.onGoingPlayers
            ],  # Assuming Player class
            "join_code": self.join_code,
        }
