// Javascript including jQuery for an implementation of Battleship

/**
 * List of game functions:
 * setOpening ()
 * init ()
 * stateShifter (state, gameOver)
 * startActiveTurn()
 * processTargetSelection () 
 *
 * event handlers:
 * $(".startGameButton").click
 * reset ()
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
    var playerTitles = ['Player One', 'Player Two'];
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
        rivalPlayer,
        activeGame,
        prevMove,
        prevTargetComplete,
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
        NEXT_TURN_MSG: "Get ready for your turn, ",
        ON_TARGET: "Hit!",
        OFF_TARGET: "Miss!",
        GAME_OVER_TOP: "Congratulations to the Winner!",
        GAME_OVER_MSG: " Won the Game!",
        RESTART_BUTTON: "Restart",
        SELECT_TARGET: "Select your target by clicking on active board",
        SELECT_TARGET_BUTTON: "Select",
        START_GAME: "Start!",
        WELCOME: "Welcome, start a new game:",
        TARGET_COMPLETE: "That hit sank a ship!",
        GAME_IN_PROGRESS: "Game in progress",
        ERROR_DRAW: "DRAW: Game over but nobody won! (ERROR)"
    };


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
        $("#slogan").text(strings.SANK_BATTLESHIP);
        $("#feedbackMessage").text(strings.WELCOME);

        // -- set button text and class
        $("button#continue").text(strings.START_GAME);
        $("button#continue").addClass("startGameButton");

        // -- show proper sections
        $("header").show();
        $("section#messages").show();
        $("section#playerInput").show();
        $("footer").show();

        // -- proper color
        $("body").removeClass();

        // -- show proper boards
        $("#gameStage").hide();

        // -- set listener on initial button
        $(".startGameButton").click(function () {
            console.log("--startGameButton");
            event.preventDefault();
            init();
        });
    }
    setOpening();

    /**
     * Starts a new game from the start page
     */
    function init (){
        console.log("--init, gameOver:", gameOver);
        
        // game is no longer over, has begun
        gameOver = false;
        currentPlayer = 0;
        rivalPlayer = 1;

        // each player gets a set of targets 


        // make cells listen for clicks, pass on coordinate
        $(".rivalGrid .cell").click(function(){
            console.log("processTargetSelection", processTargetSelection);
            console.log("this.className[0]", this.className[0]);
            processTargetSelection(this, this.className[0], this.className[1]);
        });

        // set target locations and save
        // TODO make random

        // show next screen, Ready Player One
        stateShifter("readyPlayerOne", gameOver);
    }



    /**
     * Shifts between states
     * readyPlayerOne, PlayerTurn, GameOver
     * @param {string} state - current feedback state
     */

    function stateShifter (state) {
        console.log("--stateShifter, state:", state);

        //********** NEED TO REACT TO prevMOVE, LAST TARGET COMPLETE, ALL TARGETS COMPLETE

        // -- remove button class and text
        var $continueButton = $("button#continue");
        $continueButton.removeClass();
        $continueButton.text('');
        $continueButton.unbind();

        // -- get text field elements
        // var $headline = $("#headline");
        var $slogan = $("#slogan");
        var $feedbackMessage = $("#feedbackMessage");
        var $currentPlayerName = $("#currentPlayerName");
        var $currentInstructions = $("#currentInstructions");
        // var $feedbackButton = $("button.feedbackButton");
        
        // -- set up empty variabls to be used by various states
        // -- get current text if present
        var continueButtonClass = '';
        var continueButtonText = '';
        // var headlineText = $headline.text();
        var sloganText = $slogan.text();
        var feedbackMessage = $feedbackMessage.text();
        var currentInstructions = $currentInstructions.text();
        var currentPlayerName = playerTitles[currentPlayer] + " " + currentPlayer;
        
        // set up message text according to state
        // -- ready player one
        if (state === "readyPlayerOne") {
            // currentInstructions = strings.NEXT_TURN_MSG;
            sloganText = strings.GAME_IN_PROGRESS;
            feedbackMessage = strings.FIRST_TURN_MSG;
            continueButtonText = strings.READY_BUTTON;
            continueButtonClass = "startTurnButton";

            // change color
            $("body").addClass("contrast");

            // show no boards but show stage
            $(playerClasses[currentPlayer]).hide();
            $(playerClasses[rivalPlayer]).hide();
            $("#gameStage").show();
        }

        // -- nextPlayer, report results and prepare to move on
        if (state === "nextPlayer") {
            
            // show/hide boards
            $(playerClasses[currentPlayer]).hide();          
            $(playerClasses[rivalPlayer]).hide();            

            currentInstructions = strings.NEXT_TURN_MSG + playerTitles[currentPlayer];
            continueButtonClass = "startTurnButton";

            if (prevMove === "hit") {
                feedbackMessage = strings.ON_TARGET;
                if (prevTargetComplete === "true") {
                    feedbackMessage = strings.TARGET_COMPLETE;
                }
            } else if (prevMove === "miss") {
                feedbackMessage = strings.OFF_TARGET;
            }
            continueButtonText = strings.READY_BUTTON;            

            // change color
            $("body").addClass("contrast");

        }

        if (state === "activeTurn") {
            currentInstructions = strings.SELECT_TARGET + ", " + playerTitles[currentPlayer];
            feedbackMessage = '';

            continueButtonClass = "hide";

            // return orig color
            $("body").removeClass();

            // hide rival player's boards
            $(playerClasses[rivalPlayer]).hide();
            // show current player boards
            $(playerClasses[currentPlayer]).show();
        }

        // set up messages for gameover
        if (state === "gameover") {
            // currentInstructions = strings.GAME_OVER_TOP;

            if (winner && winner == playerTitles[0]) {
                feedbackMessage = playerTitles[0] + strings.GAME_OVER_MSG;
            } else if (winner && winner == playerTitles[1]) {
                feedbackMessage = playerTitles[1] + strings.GAME_OVER_MSG;
            } else {
                feedbackMessage = scripts.ERROR_DRAW;
            }
            continueButtonText = strings.RESTART_BUTTON;
            continueButtonClass = "restartButton";

            // change color
            $("body").addClass("contrast");

            // hide boards
            $(playerClasses[currentPlayer]).hide();
            $(playerClasses[rivalPlayer]).hide();
        }

        // -- set button class/text
        $continueButton.addClass(continueButtonClass);
        $continueButton.text(continueButtonText)

        // -- set messages
        // $headline.text(headlineText);
        $slogan.text(sloganText);
        $feedbackMessage.text(feedbackMessage);
        $currentPlayerName.text(currentPlayerName);
        $currentInstructions.text(currentInstructions);           

        // -- bind click events to newly renamed button
        // go from interstitial to active turn 
        $(".startTurnButton").click(function(){
            console.log("--startTurnButton");
            event.preventDefault();
            
            stateShifter("activeTurn");
        });
        // go from gameover to restart
        $(".restartButton").click(function(){
            console.log("--restartButton");
            event.preventDefault();
            
            reset();
        });        
    }


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

        var state; 
        // TODO error handling to ensure we're inbounds

        // Is it a hit or a miss?
        // compare col/row to col/row of remaining targets

        // -- check if this was a hit or miss
            // -- if a target is at that col/row, 
            // mark as hit on target
            // add class 'hit' to cell
            // set prevMove variable to 'hit'
            // -- check whether this completes the target 'sinks it'
                // --if completes
                // set prevTargetComplete variable to 'true'
                // -- allTargetsComplete? 'sunk'
                    // -- if yes set allTargetsComplete to true
                    // -- else set allTargetsComplete to false

                // -- if doesn't complete
                // set prevTargetComplete variable to 'false'

            // -- if it is a miss
            // add class 'miss' to cell
            // set prevMove variable to 'miss'
            // set prevTargetComplete variable to 'false'

        // -- pass prevMove, prevTargetComplete, allTargetsComplete variables to 'feedback'
        // don't really pass them, but that idea
        
        // process turn and deliver that info to feedback
        // check/set gameOver
        // check/set hit/miss
        
        // advance whose turn it is

        // TODO remove, for testing
        prevMove = "hit";

        if (gameOver) {
            state = "gameover";
        } else {
            // advance turn
            currentPlayer = currentPlayer ? 0 : 1;
            rivalPlayer = currentPlayer ? 0 : 1;
            state = "nextPlayer"
        }

        stateShifter(state);

    }

    /**
     * Returns you to the start page from game over
     */
    function reset () {
        console.log("resetting game --reset");
        // TODO reset but have leaderboard etc
        setOpening();
    }



});