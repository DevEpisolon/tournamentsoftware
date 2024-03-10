class Tournament:
    def __init__(self, tournamentName, tournamentId, STATUS, STARTDATE, ENDDATE, createdAt, updatedAt, matches=None, MaxSlotsCount=None, TournamentType=None, TeamBoolean=None, AllotedMatchTime=None, Players=None, tournamentWinner = None, droppedPlayers = None):       
        self.tournamentName = tournamentName
        self.tournamentId = tournamentId
        self.STATUS = STATUS
        self.STARTDATE = STARTDATE
        self.ENDDATE = ENDDATE
        self.createdAt = createdAt
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

    def set_tournamentWinner(self,Player)
        self.tournamentWinner = Player

#Functions
    '''
    CreateAll the Matches for the tournament
    '''
    def createMatches(self):
        matchCount = len(get_Players) // 2        
        for i in range(matchCount):
            match = Match()

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
    def addPlayertoTournament(self,Player)
        self.Players.append(Player)
    '''
    Remove a player from the tournament
    player = player to remove
    '''
    def removePlayerfromTournament(self,Player)
        self.Players.remove(Player)
        self.droppedPlayers.append(Player)
    '''
    To view the matches in the tournament
    tournament = tournament you would like to view
    '''
    def viewMatchesinTournament(self,tournament):
        for x in tournament.getMatches():
            print(f"{x.toString()}")







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


