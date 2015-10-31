// Javascript including jQuery for an implementation of Battleship

$(document).ready(function () {

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

    // -- game states
    var gameOver;
    var currentPlayer;
    // var activeGame = false;
    var winner = null;
    var lastMove = null;

    // -- strings, initial settings
    var strings = {
        GAME_NAME: "Friendship",
        SANK_BATTLESHIP: "You sank my Battleship!",
        FIRST_TURN_MSG: "Ready Player One",
        READY_BUTTON: "Ready!",
        START_ANOTHER_GAME: "Thank you for playing! Want to play again?",
        NEXT_TURN_MSG: "Now, get ready for your turn",
        ON_TARGET: "Hit!",
        OFF_TARGET: "Miss!",
        GAME_OVER_TOP: "Congratulations to the Winner!",
        GAME_OVER_MSG: " Won the Game!",
        RESTART_BUTTON: "Restart",
        SELECT_TARGET: "Select your target using the keyboard",
        SELECT_TARGET_BUTTON: "Select",
    };

    var topMessage = strings.SANK_BATTLESHIP;
    var feedbackMessage;
    var feedbackButtonMessage;

    // -- buttons
    var startGameButton = document.getElementById('startGame');
    var feedbackButton = document.getElementById('feedback');

    /**
     * Set up the game at the very beginning
     * Allows modular changing of game title and other strings
     */

    function setOpening () {
        console.log("an implementation of Battleship");

        // no active game yet
        // gameOver = true;

        // -- set opening text
        $("title").text(strings.GAME_NAME);
        var $headline = $("#headline");
        $headline.text(strings.GAME_NAME);

        // -- show proper screens
        $("#startScreen").show();
        $("#feedbackScreen").hide();
        $("#activeScreen").hide();
    }
    setOpening();


    /**
     * Sets up 'Feedback' or 'Privacy' screen before turn
     * readyPlayerOne, PlayerTurn, GameOver
     * @param {string} state - current feedback state
     * @param {bool} gameOver - gameover state
     */

    function feedback (state, gameOver) {
        console.log("FEEDBACK state: ", state);
        console.log("feedback start gameOver:", gameGrids);

        // process previous move if there was one
        // check if game is over

        // get text field variables
        var $topMessage = $(".topMessage");
        var $feedbackMessage = $("h3.feedbackMessage");
        var $feedbackButtonMessage = $("button.feedbackButtonMessage");


        console.log("setting messages");
        
        // set up message text according to state
        if (state === "readyPlayerOne") {
            topMessage = strings.SANK_BATTLESHIP;
            feedbackMessage = strings.FIRST_TURN_MSG;
            feedbackButtonMessage = strings.READY_BUTTON;
        }

        // report results and prepare to move on
        if (state === "nextPlayer") {
            topMessage = strings.SANK_BATTLESHIP;
            if (lastMove === "hit") {
                feedbackMessage = strings.ON_TARGET;
            } else if (lastMove === "miss") {
                feedbackMessage = strings.OFF_TARGET;
            }
            feedbackButtonMessage = strings.READY_BUTTON;            
        }

        // set up messages for gameover
        if (state === "gameover") {
            topMessage = strings.GAME_OVER_TOP;
            if (winner && winner == playerTitles[0]) {
                feedbackMessage = playerTitles[0] + strings.GAME_OVER_MSG;
            }
            if (winner && winner == playerTitles[1]) {
                feedbackMessage = playerTitles[1] + strings.GAME_OVER_MSG;
            }
            feedbackButtonMessage = strings.RESTART_BUTTON;
        }

        // set text
        $topMessage.text(topMessage);        
        $feedbackMessage.text(feedbackMessage);        
        $feedbackButtonMessage.text(feedbackButtonMessage);        

        // hide start screen & active turn
        // display feedback screen
        $("#startScreen").hide();
        $("#activeScreen").hide();
        $("#feedbackScreen").show();
    }

    /**
     * Starts a new game from the start page
     */
    function init (){
        // game is no longer over, has begun
        gameOver = false;
        currentPlayer = 0;

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
                playerGrid.push(gridRow);
            }
            gameGrids.push(playerGrid);
        }
        console.log("setting up new game boards for yourself and your rival");

        // set up empty board divs
        // TODO make dynamic

        // set targets
        // TODO make random

        // show next screen, Ready Player One
        console.error("init end gameOver", gameOver);
        feedback("readyPlayerOne", gameOver);
    }

    /**
     * start one or the other player's turn
     */
    function startActiveTurn () {
        console.log("ACTIVE gameOver", gameOver);
        // render board with updates
        playerGrid = gameGrids[currentPlayer];

        for (var j = 0; j < rows; j++) {
            for (var k = 0; k < rows; k++) {

            }
        }

        // update messages
        $('.topMessage').text(strings.SANK_BATTLESHIP);        
        $('.currentInstructions').text(strings.SELECT_TARGET);        
        $('.feedbackButtonMessage').text(strings.SELECT_TARGET_BUTTON);

        // hide feedback screen, start for good measure
        // show active scree
        $("#startScreen").hide();
        $("#feedbackScreen").hide();
        $("#activeScreen").show();

        // wait on user input
    }


    /**
     * Returns you to the start page from game over
     */
    function reset () {
        console.log("resetting game, taking us out of an active game state");
        console.log("ready for user to start a game");
        setOpening();
        $(".topMessage").text(strings.START_ANOTHER_GAME);

    }


    /** Handle input from user **/

    /**
     * Begin game actions from startScreen
     * @param {event} - click event
     */
    startGameButton.onclick = function (event) {
        console.log("startGameButton..., gameOver", gameOver);
        event.preventDefault();
        init();
    };

    /**
     * Get out of feedback/privacy screen
     * display start screen or active turn screen
     * @param {event} - click event
     */
    feedbackButton.onclick = function (event) {
        console.log("gameGrids", gameGrids);
        console.error("feedbackButton... display start screen or active turn screen, gameOver: ", gameOver);
        event.preventDefault();

        // time to go back to the start
        if (gameOver) {
            // was just showing the game over screen
            console.log("detecting game over, gameOver: ", gameOver);
            reset();
        }
        // time to continue the game!
        startActiveTurn();
    };

    /**
     * Make selection on active game screen
     * display other player's privacy before turn, or game over "
     * @param {event} - click event
     */
    $("#selection").submit(function (event) {
        console.log("selection submission ...");
        event.preventDefault();
        var results; 

        // get user input
        // TODO error protection, valid characters etc
        var selection = '';
        selection = $("#gridSelection").val()
        
        // process turn and deliver that info to feedback
        // check/set gameOver
        // check/set hit/miss
        // advance whose turn it is
        // TODO remove, for testing
        lastMove = "hit";

        if (gameOver) {
            results = "gameover";
        } else {
            results = "nextPlayer"
        }

        feedback(results);

        console.log("display other player's privacy before turn, or game over");
    });


});