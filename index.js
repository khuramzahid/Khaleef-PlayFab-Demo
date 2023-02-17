var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient

PlayFab.settings.titleId = "A68E3";
var player1LoginRequest = {
    TitleId: PlayFab.settings.titleId,
    CustomId: "Player 1",
    CreateAccount: true
};
var player2LoginRequest = {
    TitleId: PlayFab.settings.titleId,
    CustomId: "Player 2",
    CreateAccount: true
};

function begin() {
    try {
        let player1Token = null;
        let player2Token = null;
        PlayFabClient.LoginWithCustomID(player1LoginRequest, (err, player1) => {
            player1Token = player1.data.EntityToken;
            console.log("Player 1 Token: ");
            console.log(player1Token);
            PlayFabClient.LoginWithCustomID(player2LoginRequest, (err, player2) => {
                player2Token = player2.data.EntityToken;
                console.log("Player 2 Token: ");
                console.log(player2Token);
            });
        });
    }
    catch(ex) {
        console.log(ex);
    }
}

begin();