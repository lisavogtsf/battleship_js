// Javascript including jQuery for an implementation of Battleship
$(document).ready(function () {
    console.log("an implementation of Battleship");

    /**
     * Game Constants
     */ 

    // -- grid dimensions, square, equal number of columns and rows
    // var rows = 10;
    var rows = 2;

    // -- targets "ships"
    // TODO /lv plural?
    var targetType = "ship";
    var targetLengths = [2, 3, 3, 4, 5];
    // var shipsInGame = 5;
    var targetsInGame = 1;

    // -- players
    var numberOfPlayers = 2;
    var playerTitles = ['Player 1', 'Player 2'];

    // -- grids, declare them
    var gameGrids = []; // {3D array or array of grids} all player grids in game
    var playerGrid = []; // {two-dimensional array} one player's grid, made of rows, cells
    var gridRow = []; // {array of objects} a single row of one player's grid
    var gridCell = {
        targetPresent: false,
        hasBeenTarget: false
    }; // {object} status of a single space on row/in grid

    // -- inactive game state
    var gameOver = true;
    // var activeGame = false;
    var winner = null;

    // -- buttons
    var startGameButton = document.getElementById('startGame');

    /**
     * Sets up 'Feedback' or 'Privacy' screen before turn
     * readyPlayerOne, PlayerTurn, GameOver
     * @param {string} state - current feedback state
     */

    function feedback (state) {
        console.log("feedback state", state);

        // process previous move if there was one
        // check if game is over

        // display feedback screen

        // display messages related to state fed in
        // button text
    }

    /**
     * Starts a new game from the start page
     */
    function init (){
        // game is no longer over, has begun
        var gameOver = false;
        console.log("initializing a new game state, gameOver:", gameOver);

        // each player gets an empty grid 
        gameGrids = []; // i grids
        for (var i = 0; i < numberOfPlayers; i++) {
            playerGrid = []; // j rows
            for (var j = 0; j < rows; j++) {
                gridRow = []; // k cells
                for (var k = 0; k < rows; k++) {
                    gridRow.push(gridCell);
                }
                // console.log("gridRow", gridRow);
                playerGrid.push(gridRow);
            }
            // console.log("playerGrid", playerGrid);
            gameGrids.push(playerGrid);
        }
        // console.log("gameGrids", gameGrids);
        console.log("setting up new game boards for yourself and your rival");

        // show next screen, Ready Player One
        feedback("readyPlayerOne");
    }


    /**
     * Returns you to the start page from game over
     */
    function reset () {
        console.log("resetting game, taking us out of an active game state");
        console.log("ready for user to start a game");
    }

    /**
     * Begin game actions
     * @param {event} - click event
     */
    startGameButton.onclick = function (event) {
        event.preventDefault();
        init();
    };

    /**
     * Get out of feedback/privacy screen
     * display start screen or active turn screen
     * @param {event} - click event
     */
    feedback.onclick = function (event) {
        event.preventDefault();
        console.log("display start screen or active turn screen");

    };

    /**
     * Make selection on active game screen
     * display other player's privacy before turn, or game over "
     * @param {event} - click event
     */
    selection.onclick = function (event) {
        event.preventDefault();
        console.log("display other player's privacy before turn, or game over");
    };


});