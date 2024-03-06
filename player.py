class Player:
    def __init__(self, playername, displayname, uniqueid, email, wins=0, losses=0, ties=0, winstreaks=0, match_history=[], avatar=None, join_date=None, current_tournament_wins=0, current_tournament_losses=0, current_tournament_ties=0):
        self.playername = playername
        self.displayname = displayname
        self.uniqueid = uniqueid
        self.email = email
        self.wins = wins
        self.losses = losses
        self.ties = ties
        self.winstreaks = winstreaks
        self.match_history = match_history
        self.avatar = avatar
        self.join_date = join_date
        self.current_tournament_wins = current_tournament_wins
        self.current_tournament_losses = current_tournament_losses
        self.current_tournament_ties = current_tournament_ties

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

