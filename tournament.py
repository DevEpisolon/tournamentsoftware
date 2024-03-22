from datetime import datetime
class Tournament:
    def __init__(self, tournamentName, tournamentId, STATUS, STARTDATE, ENDDATE, createdAt, updatedAt, matches=None, MaxSlotsCount=None, TournamentType=None, TeamBoolean=None, AllotedMatchTime=None, Players=None, tournamentWinner = None, droppedPlayers = None):       
        self.tournamentName = tournamentName
        self.tournamentId = tournamentId
        self.STATUS = STATUS
        self.STARTDATE = STARTDATE
        self.ENDDATE = ENDDATE
        self.createdAt = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.updatedAt = updatedAt
        self.matches = []
        self.MaxSlotsCount = MaxSlotsCount
        self.TournamentType = TournamentType
        self.TeamBoolean = TeamBoolean
        self.AllotedMatchTime = AllotedMatchTime
        self.Players = []
        self.tournamentWinner = tournamentWinner
        self.droppedPlayer = []
    # Getter and setter methods for each attribute
    def get_tournamentName(self):
        return self.tournamentName

    def set_tournamentName(self, tournamentName):
        self.tournamentName = tournamentName

    def get_tournamentId(self):
        return self.tournamentId

    def set_tournamentId(self, tournamentId):
        self.tournamentId = tournamentId

    def get_STATUS(self):
        return self.STATUS

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

    def set_createdAt(self, createdAt):
        self.createdAt = createdAt

    def get_updatedAt(self):
        return self.updatedAt

    def set_updatedAt(self, updatedAt):
        self.updatedAt = updatedAt

    def get_matches(self):
        return self.matches

    def set_matches(self, matches):
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

    def set_tournamentWinner(self,Player):
        self.tournamentWinner = Player

#Functions
    '''
    Remove a player from a tournament
    player = player to remove
    '''
    def removePlayerfromTournament(self,player):
        get_Players().remove(playerid)  
    '''
    Add a singulaur player to the tournament
    player = player to add to tournament
    '''
    def addPlayertoTournament(self,Player):
        self.Players.append(Player)
    '''
    Remove a player from the tournament
    player = player to remove
    '''
    def removePlayerfromTournament(self,Player):
        self.Players.remove(Player)
        self.droppedPlayers.append(Player)
    '''
    To view the matches in the tournament
    tournament = tournament you would like to view
    '''
    def viewMatchesinTournament(self,tournament):
        for x in tournament.getMatches():
            print(f"{x.toString()}")
    
    '''
    To get the int of the players in the tournament
    '''
    def getPlayerCount(self):
        return len(self.Players)
    '''
    To get a certian match in tournament
    matches is all the matches in tournament
    matchid is the match id
    '''
    def get_match_by_id(matches, matchid):
    for match in all_matches:
        if match.id == match_id:
            return match
    return None
    '''
    To create the matches in the tournaemnt
    '''
    def createMatches(self):
        matches = []
        matchCount = self.getPlayerCount() - 1
        tempPlayers = self.get_Players()  # Assuming get_Players is a method of the Tournament class
        count = 0
        nextCountID = self.getPlayerCount()/2
        playersInMatch = []
        for i in range(matchCount):
            count +=1
            if(count == 2):
                #createMatch
                count = 0
            else:
                nextCountID -=1
            for _ in range(self.get_MaxSlotsCount()):  # Assuming get_MaxSlotsCount is a method of the Tournament class
                playersInMatch.append(tempPlayers.pop())
            match = Match(matchid=i, slots=getSlots(), match_status=None, max_rounds=None,
                      tournamentName=self.get_tournamentName(), players=playersInMatch,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=None, endTime=None)
            matches.append(match)
        set_matches(matches)
            


    



    # Helper function to print tournament details
    def print_details(self):
        print("Tournament Name:", self.tournamentName)
        print("Tournament ID:", self.tournamentId)
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

