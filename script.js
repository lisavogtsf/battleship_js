// Javascript including jQuery for an implementation of Battleship

/**
 * List of game functions:
 * setOpening ()
 * feedback (state, gameOver)
 * init ()
 * startActiveTurn()
 * reset ()
 *
 * event handlers:
 * startGameButton.onclick
 * feedbackButton.onclick
 * processTargetSelection () 
 */


$(document).ready(function () {

    /**
     * Game Constants
     */ 

    // -- grid dimensions, square, equal number of columns and rows
    // TODO add rows
    // var rows = 10;
    var rows = 2;

    // -- targets "ships"
    // TODO /lv plural?
    var targetType = "ship";
    var targetLengths = [2, 3, 3, 4, 5];
    var targetsInGame = 1;
    // TODO add more targets
    var possibleTargets = [
        {
            placed: false,
            length: 2,
            location: []
        }
    ];

    // -- players
    var numberOfPlayers = 2;
    var playerTitles = ['Player 1', 'Player 2'];
    var playerClasses = ['.playerOne', '.playerTwo'];

    // -- grids, declare them
    var gameGrids = []; // {3D array or array of grids} all player grids in game
    var playerGrid = []; // {two-dimensional array} one player's grid, made of rows, cells
    var gridRow = []; // {array of objects} a single row of one player's grid
    var gridCell = {
        targetPresent: false,
        hasBeenTarget: false,
        coords: ''
    }; // {object} status of a single space on row/in grid
    var columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    var rowHeaders = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // -- game state information
    var currentPlayer,
        activeGame,
        lastMove,
        lastTargetComplete,
        allTargetsComplete,
        gameOver,
        winner;

    // -- strings, initial settings
    var strings = {
        GAME_NAME: "Friendship",
        SANK_BATTLESHIP: "\"You sank my Battleship!\"",
        FIRST_TURN_MSG: "Ready Player One",
        READY_BUTTON: "Ready!",
        START_ANOTHER_GAME: "Thank you for playing! Want to play again?",
        NEXT_TURN_MSG: "Now, get ready for your turn",
        ON_TARGET: "Hit!",
        OFF_TARGET: "Miss!",
        GAME_OVER_TOP: "Congratulations to the Winner!",
        GAME_OVER_MSG: " Won the Game!",
        RESTART_BUTTON: "Restart",
        SELECT_TARGET: "Select your target by clicking on that cell",
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
        console.log("an implementation of Battleship--setOpeneing");

        // no active game yet
        // gameOver = true;

        // -- set opening text
        $("title").text(strings.GAME_NAME);
        $("#headline").text(strings.GAME_NAME);

        // -- show proper sections
        $("#startScreen").show();
        $("#feedbackScreen").hide();
        $("#activeScreen").hide();
        $("footer").show();

        // -- show proper boards
        $("#gameStage").hide();
        $(playerClasses[0]).hide();
        $(playerClasses[1]).hide();
    }
    setOpening();


    /**
     * Sets up 'Feedback' or 'Privacy' screen before turn
     * readyPlayerOne, PlayerTurn, GameOver
     * @param {string} state - current feedback state
     * @param {bool} gameOver - gameover state
     */

    function feedback (state, gameOver) {
        console.log("--feedback, state:", state);

        // process previous move if there was one
        // check if game is over
        //********** NEED TO REACT TO LASTMOVE, LAST TARGET COMPLETE, ALL TARGETS COMPLETE

        // get text field variables
        var $headline = $("#headline");
        var $topMessage = $(".topMessage");
        var $feedbackMessage = $("h3.feedbackMessage");
        var $feedbackButtonMessage = $("button.feedbackButtonMessage");
        
        // set up message text according to state
        if (state === "readyPlayerOne") {
            topMessage = strings.NEXT_TURN_MSG;
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
        console.log("--init, gameOver:", gameOver);
        
        // game is no longer over, has begun
        gameOver = false;
        currentPlayer = 0;

        // each player gets a set of targets 


        // make cells listen for clicks, pass on coordinate
        $(".rivalGrid .cell").click(function(){
            console.log("processTargetSelection", processTargetSelection);
            console.log("this.className[0]", this.className[0]);
            processTargetSelection(this, this.className[0], this.className[1]);
        });

        // set targets
        // TODO make random
        for (var i = 0; i < numberOfPlayers; i++) {
            if (i === 0) {

            }
        }

        // show next screen, Ready Player One
        feedback("readyPlayerOne", gameOver);
    }

    /**
     * start one or the other player's turn
     */
    function startActiveTurn () {

        // -- update messages
        $('.topMessage').text(strings.SANK_BATTLESHIP);        
        $('.currentInstructions').text(strings.SELECT_TARGET);        
        $('.feedbackButtonMessage').text(strings.SELECT_TARGET_BUTTON);
        $('.currentPlayer').text(playerTitles[currentPlayer]);

        // hide feedback screen, start for good measure
        // -- show active screens
        $("#startScreen").hide();
        $("#feedbackScreen").hide();
        $("#activeScreen").show();
        $("#gameStage").show();

        // -- show active boards
        $(playerClasses[currentPlayer]).show();
        $(playerClasses[!currentPlayer]).hide();

        // wait on user click
    }

    /**
     * Returns you to the start page from game over
     */
    function reset () {
        console.log("resetting game --reset");
        setOpening();
        $(".topMessage").text(strings.START_ANOTHER_GAME);
    }


    /** Handle input from user, buttons, clicks **/

    /**
     * Begin game actions from startScreen
     * @param {event} - click event
     */
    startGameButton.onclick = function (event) {
        console.log("--startGameButton, event", event);
        event.preventDefault();
        init();
    };

    /**
     * Get out of feedback/privacy screen
     * display start screen or active turn screen
     * @param {event} - click event
     */
    feedbackButton.onclick = function (event) {
        console.log("--feedbackButton, event:", event);
        event.preventDefault();

        // time to go back to the start
        if (gameOver) {
            // was just showing the game over screen
            console.log("in feedbackButton detecting game over, gameOver: ", gameOver);
            reset();
        }
        // time to continue the game!
        startActiveTurn();
    };

    /**
     * Make selection on active game screen
     * display other player's privacy before turn, or game over 
     * not actually a button, function run on clicking rivalGrid cell
     * @param {object} element - clicked element
     * @param {string} col - column coordinate
     * @param {string} row - row coordinate
     */
    function processTargetSelection (element, col, row) {
        console.log("--processTargetSelection");
        console.log("element, col, row", element, col, row);

        var results; 
        // TODO error handling to ensure we're inbounds

        // Is it a hit or a miss?
        // compare col/row to col/row of remaining targets

        // -- check if this was a hit or miss
            // -- if a target is at that col/row, 
            // mark as hit on target
            // add class 'hit' to cell
            // set lastMove variable to 'hit'
            // -- check whether this completes the target 'sinks it'
                // --if completes
                // set lastTargetComplete variable to 'true'
                // -- allTargetsComplete? 'sunk'
                    // -- if yes set allTargetsComplete to true
                    // -- else set allTargetsComplete to false

                // -- if doesn't complete
                // set lastTargetComplete variable to 'false'

            // -- if it is a miss
            // add class 'miss' to cell
            // set lastMove variable to 'miss'
            // set lastTargetComplete variable to 'false'

        // -- pass lastMove, lastTargetComplete, allTargetsComplete variables to 'feedback'
        // don't really pass them, but that idea
        
        // process turn and deliver that info to feedback
        // check/set gameOver
        // check/set hit/miss
        // advance whose turn it is
        // TODO remove, for testing
        lastMove = "hit";

        if (gameOver) {
            results = "gameover";
        } else {
            // advance turn
            currentPlayer = players
            results = "nextPlayer"
        }

        // feedback(results);

        console.log("display other player's privacy before turn, or game over");
    }


});