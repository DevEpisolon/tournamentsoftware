class Player:
    def __init__(self, playername, displayname, uniqueid=None, email=None, avatar=None, join_date=None, aboutMe=None, firebase_uid=None, # user info
                    wins=0, losses=0, ties=0, wlratio=0, winstreaks=0, match_history=[], # general stats
                    current_tournament_wins=0, current_tournament_losses=0, current_tournament_ties=0,
                    pending_invites=None, friends=None): # tourney info
        self.playername = playername
        self.displayname = displayname
        self.uniqueid = uniqueid
        self.email = email
        self.avatar = avatar
        self.wins = wins
        self.losses = losses
        self.ties = ties
        self.wlratio = wlratio
        self.winstreaks = winstreaks
        self.match_history = match_history
        self.avatar = avatar
        self.join_date = join_date
        self.current_tournament_wins = current_tournament_wins
        self.current_tournament_losses = current_tournament_losses
        self.current_tournament_ties = current_tournament_ties
        self.aboutMe = aboutMe
        self.pending_invites = pending_invites
        self.friends = friends
        self.firebase_uid = firebase_uid


    # for calling print() on a player
    def __str__(self):
        return f"""Dummy Player Info:
            Player: {self.displayname}-{self.playername} | ID: {self.uniqueid}
            Email: {self.email} | Join Date: {self.join_date}
            Wins: {self.wins} | Losses: {self.losses} | Ties: {self.ties} | W/L: {self.wlratio}%
            """

    @classmethod
    def create_dummy(cls, playername, displayname, wins=0, losses=0, ties=0):
        return cls(
            playername=playername,
            displayname=displayname,
            wins=wins,
            losses=losses,
            ties=ties,
        )

    # Getters
    def get_playername(self):
        return self.playername

    def get_displayname(self):
        return self.displayname

    def get_uniqueid(self):
        return self.uniqueid

    def get_email(self):
        return self.email

    def get_wins(self):
        return self.wins

    def get_losses(self):
        return self.losses

    def get_ties(self):
        return self.ties

    def get_wlratio(self):
        return self.wlratio

    def get_winstreaks(self):
        return self.winstreaks

    def get_match_history(self):
        return self.match_history

    def get_avatar(self):
        return self.avatar

    def get_join_date(self):
        return self.join_date

    def get_current_tournament_wins(self):
        return self.current_tournament_wins

    def get_current_tournament_losses(self):
        return self.current_tournament_losses

    def get_current_tournament_ties(self):
        return self.current_tournament_ties
    def get_firebaseID(self):
        return self.firebase_uid

    # Setters
    def set_playername(self, playername):
        self.playername = playername

    def set_displayname(self, displayname):
        self.displayname = displayname

    def set_uniqueid(self, uniqueid):
        self.uniqueid = uniqueid

    def set_email(self, email):
        self.email = email

    def set_wins(self, wins):
        self.wins = wins

    def set_losses(self, losses):
        self.losses = losses

    def set_ties(self, ties):
        self.ties = ties

    def set_wlratio(self, wins, losses):
        return wins if losses == 0 else wins / losses

    def set_winstreaks(self, winstreaks):
        self.winstreaks = winstreaks

    def set_match_history(self, match_history):
        self.match_history = match_history

    def set_avatar(self, avatar):
        self.avatar = avatar

    def set_join_date(self, join_date):
        self.join_date = join_date

    def set_current_tournament_wins(self, current_tournament_wins):
        self.current_tournament_wins = current_tournament_wins

    def set_current_tournament_losses(self, current_tournament_losses):
        self.current_tournament_losses = current_tournament_losses

    def set_current_tournament_ties(self, current_tournament_ties):
        self.current_tournament_ties = current_tournament_ties

    def increase_wins(self):
        self.wins += 1

    def decrease_wins(self):
        if self.wins > 0:
            self.wins -= 1
        else:
            print("Error: Number of wins cannot be negative.")

    def get_aboutMe(self):
        return self.aboutMe

    def set_aboutMe(self, info):
        if info and len(info) > 25:
            raise ValueError("About Me section cannot exceed 25 characters.")
        self.aboutMe = info

    def increase_losses(self):
        self.losses += 1

    def decrease_losses(self):
        if self.losses > 0:
            self.losses -= 1
        else:
            print("Error: Number of losses cannot be negative.")

    def increase_ties(self):
        self.ties += 1

    def decrease_ties(self):
        if self.ties > 0:
            self.ties -= 1
        else:
            print("Error: Number of ties cannot be negative.")
    def get_pendingInvites(self):
        return self.pending_invites
    
    def set_pendingInvites(self,pending_friends):
        self.pending = pending_friends 
    
    def append_topendingInvites(self,senderName):
        self.pending_invites.append(senderName)

    def remove_pendingInvites(self,senderName):
        if senderName in self.pending_invites:
            self.pending_invites.remove(senderName)
    
    def get_friends(self):
        return self.friends

    def set_friends(self,friends):
        self.friends = friends
    
    def append_Friend(self,friend):
        self.friends.append(friend)

    def remove_Friend(self,friend):
        self.friends.remove(friend)
   
    '''
    To accept/decline friendRequest
    friend : displayname
    status : boolean True(accepted)  or false(declined) 
    '''

    def confirm_pendingFriendRequest(self,name,status):
        if name in self.pending_invites:
            self.remove_pendingInvites(name)
            if status:
                if name not in self.friends:
                    self.append_Friend(name)    
         
    def set_firebaseID(self,ID):
        self.firebase_uid = ID

    def update_wl_ratio(self):
        self.wlratio = round(self.wins / (self.wins + self.losses) * 100, 1)

    def update_match_history(self, match):
        if(len(self.match_history) > 7):
            self.match_history.pop(0)
        self.match_history.append(match)
