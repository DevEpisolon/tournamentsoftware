from datetime import datetime
from match import Match
class Tournament:
    def __init__(self, tournamentName, tournamentId, STATUS, STARTDATE, ENDDATE, createdAt, updatedAt, max_rounds, matches=None, MaxSlotsCount=None, TournamentType=None, TeamBoolean=None, AllotedMatchTime=None, Players=None, tournamentWinner = None, droppedPlayers = None):
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
        self.maxSlotsPerMatch = 2
        self.max_rounds = max_rounds

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
        if (self.STATUS == 0 ):
            return "In Progress"
        elif(self.STATUS == 1):
            return "Not Started"
        elif(self.STATUS == 2):
            return "Finished"
    #gets set from 0-2
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

    def set_tournamentWinner(self,Player):
        self.tournamentWinner = Player

#Functions
    '''
    Remove a player from a tournament
    player = player to remove
    '''
    def removePlayerfromTournament(self,player):
        self.get_Players().remove(player.playerid)  
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
    def viewMatchesinTournament(self):
        for x in self.get_Matches():
            print(f"{x}")
    
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
    def get_MatchbyID(self, match_id):
       # print([m for m in self.get_Matches()])
        for match in self.get_Matches():
            #print(f"Current matchID: {match.get_matchid()} Finding: {match_id}")
            if int(match.get_matchid()) == int(match_id):
                return match
        return None
    '''
    To create the matches in the tournaemnt
    '''
    def createMatches(self):
        matches = []
        matchCount = self.getPlayerCount() - 1
        tempPlayers = self.get_Players().copy()  
        #print(f"temp players: {tempPlayers}")
        count = 0
        nextCountID = self.getPlayerCount()/2
        playersInMatch = []
        #print(f"Max slots count: {self.get_MaxSlotsCount()}")
        for i in range(1,matchCount+1):
            #print(f"Count: {count}")
            count +=1

            #check count
            if(count == 2):
                #print("Came through the 2 end")
                if (len(tempPlayers)> 0):
                    for _ in range(self.get_MaxSlotsPerMatch()):
                        playersInMatch.append(tempPlayers.pop())
                    #print("The Players in the match")
                    #print([p.get_displayname() for p in playersInMatch])
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=0, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=playersInMatch,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"), endTime=None)
                    #print(m)
                else:
                    #print("Detected no players in 2 count")
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=1, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=None,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=None, endTime=None)
                count = 0
            #Uneven count
            else:
                #print("Came through the other end!")
                if (len(tempPlayers) >0):
                    for _ in range(self.get_MaxSlotsPerMatch()):
                        playersInMatch.append(tempPlayers.pop())
                    #print("The players in the match")
                    #print([p.get_displayname() for p in playersInMatch])
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=0, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=playersInMatch,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime= datetime.now().strftime("%Y-%m-%d %H:%M:%S"), endTime=None)
                    #print(m)
                else:
                    #print("Detected no players in other")
                    m = Match(matchid=i, slots=self.get_MaxSlotsPerMatch(), match_status=1, max_rounds=self.max_rounds,
                      tournamentName=self.get_tournamentName(), players=None,
                      winner_next_match_id=nextCountID, previous_match_id=None, match_winner=None,
                      match_loser=None, loser_next_match_id=None, start_date=None, end_date=None,
                      startTime=None, endTime=None)
                nextCountID -=1

            #Empty the players list to add other players
            playersInMatch = []
            matches.append(m)
        self.set_Matches(matches)


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

