var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
var PlayFabMultiplayer = playfab.PlayFabMultiplayer;

PlayFab.settings.titleId = "A68E3";
var player1LoginRequest = {
  TitleId: PlayFab.settings.titleId,
  CustomId: "Player 4",
  CreateAccount: true
};

function begin() {
  try {
    let player1Token = null;
    PlayFabClient.LoginWithCustomID(player1LoginRequest, (err, player1) => {
      player1Token = player1.data.EntityToken;
      console.log("Player 1 Token: ");
      console.log(player1Token);
      PlayFabMultiplayer.CreateMatchmakingTicket({
        Creator: {
          Entity: {
            Id: player1Token.Entity.Id,
            Type: 'title_player_account'
          }
        },
        GiveUpAfterSeconds: 30,
        QueueName: "TempQueue"
      }, 
      (err, response) => {
          console.log("Multiplayer Matchmaking Ticket");
          console.log(response);
          console.log(err);
          const intervalId = setInterval(() => {
            PlayFabMultiplayer.GetMatchmakingTicket({
              EscapeObject: true,
              QueueName: "TempQueue",
              TicketId: response.data.TicketId
            }, (err, res) => {
                console.log("Get Matchmaking Ticket");
                console.log(res);
                console.log(err);
                if(res.data.Status == "Matched") {
                  clearInterval(intervalId);
                  PlayFabMultiplayer.GetMatch({
                    EscapeObject: false,
                    MatchId: res.data.MatchId,
                    QueueName: "TempQueue",
                    ReturnMemberAttributes: true
                  }, (err, res) => {
                    console.log("Get Match");
                    console.log(res.data);
                    console.log(res.data.Members);
                    PlayFabClient.UpdatePlayerStatistics({
                      Statistics: [{
                        StatisticName: "TestStatisticName",
                        Value: 10
                      }]
                    }, (err, response) => {
                      console.log("Updated Player Statistic");
                      console.log(response);
                      PlayFabClient.GetLeaderboard({
                        StatisticName: "TestStatisticName",
                        StartPosition: 0,
                        MaxResultsCount: 10
                      }, (err, response) => {
                        console.log("GET LEADERBOARD");
                        console.log(response);
                      });
                    });
                  });
              }
            });
        }, 3000);
      });
    });
  }
  catch(ex) {
    console.log(ex);
  }
}

begin();