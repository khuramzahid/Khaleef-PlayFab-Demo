var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
var PlayFabMultiplayer = playfab.PlayFabMultiplayer;

PlayFab.settings.titleId = "A68E3";
var player1LoginRequest = {
    TitleId: PlayFab.settings.titleId,
    CustomId: "Player 1",
    CreateAccount: true
};

function begin() {
    try {
        let player1Token = null;
        PlayFabClient.LoginWithCustomID(player1LoginRequest, (err, player1) => {
            player1Token = player1.data.EntityToken;
            console.log("Player 1 Token: ");
            console.log(player1Token);
            var reqObj = {
                Creator: {
                    Entity: {
                        Id: player1Token.Entity.Id,
                        Type: 'title_player_account'
                    }
                },
                GiveUpAfterSeconds: 30,
                QueueName: "TempQueue"
            };
            PlayFabMultiplayer.CreateMatchmakingTicket(reqObj, (err, response) => {
                console.log("Multiplayer Matchmaking Ticket");
                console.log(response);
                console.log(err);
                setInterval(() => {
                    PlayFabMultiplayer.GetMatchmakingTicket({
                        EscapeObject: true,
                        QueueName: "TempQueue",
                        TicketId: response.data.TicketId
                    }, (err, res) => {
                        console.log("Get Matchmaking Ticket");
                        console.log(res);
                        console.log(err);
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