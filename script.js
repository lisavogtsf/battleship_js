// Javascript including jQuery for an implementation of Battleship

/**
 * List of game functions:
 * Player constructor and prototype functions
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
    var rows = 5;
    // var rows = 10;
    // var columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    // var rowHeaders = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    // -- game state information
    var currentPlayer,
        rivalPlayer,
        activeGame,
        prevMove,
        prevTargetId,
        prevTargetComplete,
        allTargetsComplete,
        gameOver,
        winner;

    // -- targets "ships"
    var targetType = "ship";
    var targetLengths = [2, 3, 3, 4, 5];
    var targetsInGame = 2;
    // TODO add more targets

    // -- player info, player class
    var numberOfPlayers = 2;
    var firstPlayer,
        secondPlayer;
    var players = [firstPlayer, secondPlayer];

    function Player (id) {
        this.id = id;
        this.targets = [];
        this.targetsRemaining = targetsInGame;
    }
    // add proper number/length of targets
    // TODO plus positioning
    Player.prototype.addTargets = function () {
        var newTarget;
        for (var i = 0; i < targetsInGame; i ++) {
            var currentTargetLength = targetLengths[i];
            newTarget = {
                id: i,
                status: '',
                cells: []
            };
            var newCell;
            for (var j = 0; j < currentTargetLength; j++) {
                newCell = {
                    coords: '',
                    status: ''
                };   
                newTarget.cells.push(newCell);
            }
            this.targets.push(newTarget);
        }
    };
    Player.prototype.positionTargets = function () {

        // for each target
        // get random x starting point
        // get random y starting point
        // random coin flip for orientation, right or down
        // use those to find a placement
        // will you go off the board? try again
        // figure out the coords that correspond to each cell of target
        // compare each coord with a basic array of used coord strings
        // if coord already taken try gain
        // maybe do this in a while loop until say 'target placed'

        // easy static setup, 2 targets

        this.targets[0].cells = [
            {
                coords: 'A' + (2),
            },
            {
                coords: 'A' + (3),
            }
        ];

        this.targets[1].cells = [
            {
                coords: 'B' + (1),
            },
            {
                coords: 'C' + (1),
            },
            {
                coords: 'D' + (1),
            }            
        ];
        
    };
    Player.prototype.seekTarget = function (coords) {
        prevMove = '';
        prevTargetId = null;
        this.targets.forEach(function (target) {
            target.cells.forEach(function(cell) {
                // could do error checking for row/col in bounds
                // for cell status being empty
                if (coords == cell.coords) {
                    cell.status = "hit";
                    prevMove = "hit";
                    prevTargetId = target.id;
                }
            });
        });
        if (prevMove != "hit") {
            prevMove = "miss";
        }
    };
    Player.prototype.checkTargetComplete = function (prevTargetId) {
        var targetToCheck = this.targets[prevTargetId];
        prevTargetComplete = true;
        targetToCheck.cells.forEach(function (cell){
            if (cell.status !== 'hit') {
                prevTargetComplete = false;
            }
        });
        // if all cells have been hit, remove this target from count
        if (prevTargetComplete) {
            this.targetsRemaining -= 1;
        }
    };
    Player.prototype.checkAllTargetsComplete = function () {
        return this.targetsRemaining === 0;
    }

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
        GAME_OVER_TOP: "Game Over!",
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
        $("#currentInstructions").text('');

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

        // create two players, set their targets
        firstPlayer = new Player(1);
        firstPlayer.addTargets();
        firstPlayer.positionTargets();
        firstPlayer.playerTitle = 'Player One';
        firstPlayer.playerClass = '.playerOne';

        // show targets on secret board
        var coords;
        var domSearchString = '';
        firstPlayer.targets.forEach(function (target) {
            target.cells.forEach(function (cell){
                console.log("cell", cell);
                coords = cell.coords;
                console.log("coords, cell.coords", coords, cell.coords);
                domSearchString = ".playerOne .secretGrid ." + cell.coords;
                console.log("domSearchString", domSearchString);
                $(domSearchString).addClass("target");
                // $(rivalPlayer.playerClass + " .secretGrid ." + coords).addClass(result);
                // $(firstPlayer.playerClass + " ." + coords).addClass("target");
            });
        });

        secondPlayer = new Player(2);
        secondPlayer.addTargets();
        secondPlayer.positionTargets();
        secondPlayer.playerTitle = 'Player Two';
        secondPlayer.playerClass = '.playerTwo';

        // // show targets on secret board
        // secondPlayer.targets.forEach(function (target) {
        //     target.cells.forEach(function (cell){
        //         coords = cell.coords;
        //         $(secondPlayer.playerClass + " ." + coords).addClass("target");
        //     });
        // });        

        // make cells listen for clicks, pass on coordinate
        $(".rivalGrid .cell").click(function(){
            processTargetSelection(this.className[0], this.className[1]);
        });

        // game is no longer over, has begun
        gameOver = false;
        allTargetsComplete = false;
        currentPlayer = firstPlayer;
        rivalPlayer = secondPlayer;
console.log("firstPlayer", firstPlayer);
console.log("secondPlayer", secondPlayer);

        // show next screen, Ready Player One
        stateShifter("readyPlayerOne");
    }



    /**
     * Shifts between states
     * readyPlayerOne, nextPlayer, activeTurn, gameover
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
        var currentPlayerName = currentPlayer.playerTitle;
        
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
            $(currentPlayer.playerClass).hide();
            $(rivalPlayer.playerClass).hide();
            $("#gameStage").show();
        }

        // -- nextPlayer, report results and prepare to move on
        if (state === "nextPlayer") {
            
            // show/hide boards
            $(currentPlayer.playerClass).hide();          
            $(rivalPlayer.playerClass).hide();            

            currentInstructions = strings.NEXT_TURN_MSG;
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
            currentInstructions = strings.SELECT_TARGET;
            feedbackMessage = '';

            continueButtonClass = "hide";

            // return orig color
            $("body").removeClass();

            // hide rival player's boards
            $(rivalPlayer.playerClass).hide();
            // show current player boards
            $(currentPlayer.playerClass).show();
        }

        // set up messages for gameover
        if (state === "gameover") {

            if (winner && winner == currentPlayer.id) {
                feedbackMessage = currentPlayer.playerTitle + strings.GAME_OVER_MSG;
            } else {
                feedbackMessage = strings.ERROR_DRAW;
            }
            sloganText = strings.GAME_OVER_TOP;
            currentPlayerName = '';
            currentInstructions = "";
            continueButtonText = strings.RESTART_BUTTON;
            continueButtonClass = "restartButton";

            // change color
            $("body").addClass("contrast");

            // hide boards
            $(currentPlayer.playerClass).hide();
            $(rivalPlayer.playerClass).hide();
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
    function processTargetSelection (col, row) {
        console.log("--processTargetSelection");

        var state,
            result;
        var resultSymbol = '0';
        var coords = col + row;

        prevTargetComplete = false;

        // TODO error handling to ensure we're inbounds, 
        // that this is the first targeting of this space etc

        // current player targets rival player
        rivalPlayer.seekTarget(coords);
        result = prevMove;

        // -- check if this was a hit or miss
        if (result === "hit") {
            // -- if a target is at that col/row, 
            resultSymbol = 'X';
            // -- check whether this completes the target 'sinks it'
            rivalPlayer.checkTargetComplete(prevTargetId);
            if (prevTargetComplete) {
                // -- allTargetsComplete? 'sunk'
                allTargetsComplete = rivalPlayer.checkAllTargetsComplete();
                if (allTargetsComplete) {
                    gameOver = true;
                    winner = currentPlayer.id;
                }
            }
        }
        // add result class to cell
        $(currentPlayer.playerClass + " .rivalGrid ." + coords).addClass(result);
        $(currentPlayer.playerClass + " .rivalGrid ." + coords).text(resultSymbol);
        $(rivalPlayer.playerClass + " .secretGrid ." + coords).addClass(result);
        $(rivalPlayer.playerClass + " .secretGrid ." + coords).text(resultSymbol);

        if (gameOver) {
            state = "gameover";
        } else {
            // advance turn
            currentPlayer = (currentPlayer == firstPlayer) ? secondPlayer : firstPlayer;
            rivalPlayer = (rivalPlayer == firstPlayer) ? secondPlayer : firstPlayer;
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