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
    var targetsInGame = 5;
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

        // easy static setup, 2 targets, shifted locations
        if (this.id === 1) {
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

            this.targets[2].cells = [
                {
                    coords: 'D' + (4),
                },
                {
                    coords: 'D' + (5),
                },
                {
                    coords: 'D' + (6),
                }            
            ];

            this.targets[3].cells = [
                {
                    coords: 'G' + (8),
                },
                {
                    coords: 'H' + (8),
                },
                {
                    coords: 'I' + (8),
                },
                {
                    coords: 'J' + (8),
                }                            
            ];

            this.targets[4].cells = [
                {
                    coords: 'E' + (10),
                },
                {
                    coords: 'F' + (10),
                },            
                {
                    coords: 'G' + (10),
                },
                {
                    coords: 'H' + (10),
                },
                {
                    coords: 'I' + (10),
                } 
            ];
        }
        if (this.id === 2) {
            this.targets[0].cells = [
                {
                    coords: 'B' + (2),
                },
                {
                    coords: 'B' + (3),
                }
            ];

            this.targets[1].cells = [
                {
                    coords: 'C' + (1),
                },
                {
                    coords: 'D' + (1),
                },
                {
                    coords: 'E' + (1),
                },                
            ];

            this.targets[2].cells = [
                {
                    coords: 'D' + (7),
                },
                {
                    coords: 'D' + (8),
                },
                {
                    coords: 'D' + (9),
                }            
            ];

            this.targets[3].cells = [
                {
                    coords: 'G' + (1),
                },
                {
                    coords: 'H' + (1),
                },
                {
                    coords: 'I' + (1),
                },
                {
                    coords: 'J' + (1),
                }                            
            ];

            this.targets[4].cells = [
                {
                    coords: 'E' + (5),
                },
                {
                    coords: 'F' + (5),
                },            
                {
                    coords: 'G' + (5),
                },
                {
                    coords: 'H' + (5),
                },
                {
                    coords: 'I' + (5),
                } 
            ];            
        }
        
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
        if (this.targetsRemaining === 0) {
            allTargetsComplete = true;
        }
    }

    // -- strings, initial settings
    var strings = {
        GAME_NAME: "Battleship",
        ALT_GAME_NAME: "Friendship",
        SANK_BATTLESHIP: "\"You sank my Battleship!\"",
        FIRST_TURN_MSG: "Ready Player One",
        READY_BUTTON: "Ready!",
        START_ANOTHER_GAME: "Thank you for playing! Want to play again?",
        NEXT_TURN_MSG: "Get ready for your turn, ",
        ON_TARGET: "Hit!",
        OFF_TARGET: "Miss!",
        GAME_OVER_TOP: "Game Over",
        GAME_OVER_MSG: " Won the Game!",
        TARGET_COMPLETE_VERB: " sank ",
        LAST_TARGET_COMPLETE: "\'s last ship",
        RESTART_BUTTON: "Restart",
        SELECT_TARGET: "Select your target by clicking on active board",
        SELECT_TARGET_BUTTON: "Select",
        START_GAME: "Start!",
        WELCOME: "Welcome, start a new game:",
        YOUR_TARGETS: "Your remaining ships: ",
        THEIR_TARGETS: "Their remaining ships: ",
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
                coords = cell.coords;
                domSearchString = ".playerOne .secretGrid ." + cell.coords;
                $(domSearchString).addClass("target");
            });
        });

        secondPlayer = new Player(2);
        secondPlayer.addTargets();
        secondPlayer.positionTargets();
        secondPlayer.playerTitle = 'Player Two';
        secondPlayer.playerClass = '.playerTwo';

        secondPlayer.targets.forEach(function (target) {
            target.cells.forEach(function (cell){
                coords = cell.coords;
                domSearchString = ".playerTwo .secretGrid ." + cell.coords;
                $(domSearchString).addClass("target");
            });
        });     

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
        var $headline = $("#headline");
        var $slogan = $("#slogan");
        var $feedbackMessage = $("#feedbackMessage");
        var $currentPlayerName = $("#currentPlayerName");
        var $currentInstructions = $("#currentInstructions");
        // var $feedbackButton = $("button.feedbackButton");
        
        // -- set up empty variabls to be used by various states
        var continueButtonClass = '';
        var continueButtonText = '';
        var currentInstructions = '';
        var currentPlayerName = currentPlayer.playerTitle;
        var sloganText = '';
        var feedbackMessage = '';
        // -- these messages persist unless changed
        var headlineText = $headline.text();
        
        // set up message text according to state
        // -- ready player one
        if (state === "readyPlayerOne") {
            currentInstructions = '';
            sloganText = strings.GAME_IN_PROGRESS;
            feedbackMessage = strings.FIRST_TURN_MSG;
            continueButtonText = strings.READY_BUTTON;
            continueButtonClass = "startTurnButton";
            currentPlayerName = '';

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

            // set messages that won't change
            continueButtonClass = "startTurnButton";
            continueButtonText = strings.READY_BUTTON;
            currentPlayerName = '';
            currentInstructions = strings.NEXT_TURN_MSG + currentPlayer.playerTitle;

            // set variable messages
            if (prevMove === "hit") {
                feedbackMessage = strings.ON_TARGET;
                if (prevTargetComplete === true) {
                    feedbackMessage = strings.TARGET_COMPLETE;
                }
            } else {
                feedbackMessage = strings.OFF_TARGET;
            }

            // change color
            $("body").addClass("contrast");

        }

        if (state === "activeTurn") {
            currentInstructions = strings.SELECT_TARGET;
            feedbackMessage = strings.YOUR_TARGETS + currentPlayer.targetsRemaining + ", " + strings.THEIR_TARGETS + rivalPlayer.targetsRemaining;
            continueButtonClass = "hide";
            currentPlayerName = currentPlayer.playerTitle;

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
                currentInstructions = currentPlayer.playerTitle + strings.TARGET_COMPLETE_VERB + rivalPlayer.playerTitle + strings.LAST_TARGET_COMPLETE;
            } else {
                feedbackMessage = strings.ERROR_DRAW;
            }
            headlineText = strings.ALT_GAME_NAME;
            sloganText = strings.GAME_OVER_TOP;
            currentPlayerName = '';
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
        $headline.text(headlineText);
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
        allTargetsComplete = false;

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
                rivalPlayer.checkAllTargetsComplete();
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

        // clean off board
        $(".cell").removeClass("hit miss target");
        $(".cell").text('');

        setOpening();
    }

});