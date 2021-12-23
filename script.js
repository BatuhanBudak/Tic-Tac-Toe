let playerOne;
let playerTwo;
let gameBoardArray = [];


const createGameBoard = function(){
    
    
    const boardRowAndColumnLength = 3; //Fixed game board 
    const gameBoardContainer = document.querySelector(".game-board-container");
    const mainGameContainer = document.querySelector(".main-game-container");
    mainGameContainer.style.display = "flex";
    

    function createPlayersNamesHeaders() {
        let playerOneNameHeader = document.createElement("h2");
        playerOneNameHeader.textContent = playerOne.getName();
        let playerOneScoreDisplay = document.querySelector("#player-one-score");
        let playerOneParent  = playerOneScoreDisplay.parentNode;
        playerOneParent.insertBefore(playerOneNameHeader, playerOneScoreDisplay);

        let playerTwoNameHeader = document.createElement("h2");
        playerTwoNameHeader.textContent = playerTwo.getName();
        let playerTwoScoreDisplay = document.querySelector("#player-two-score");
        let playerTwoParent = playerTwoScoreDisplay.parentNode;
        playerTwoParent.insertBefore(playerTwoNameHeader, playerTwoScoreDisplay);
    }

    function _populateGameBoardArray() {

        gameBoardArray =  createBoardMatrix(3, 3, gameBoardArray)

       for (let i = 0; i < boardRowAndColumnLength; i++) {
           for (let j = 0; j < boardRowAndColumnLength; j++) {
            gameBoardArray[i][j] = GameBoardNode(`${i}${j}`);
        
           }
        }}
  
    function _populateGameBoardElementContainer ()  {
        for (let i = 0; i < boardRowAndColumnLength; i++) {
            for (let j = 0; j < boardRowAndColumnLength; j++) {

            let boardNode = document.createElement("div");
            boardNode.classList.add("board-node");
            boardNode.textContent = "";
            boardNode.id = gameBoardArray[i][j].getId();
            gameBoardContainer.appendChild(boardNode);
            }
        }
    }
    
    _populateGameBoardArray();
    _populateGameBoardElementContainer();
    createPlayersNamesHeaders();
    createRoundWinnerDisplayHeaderElement();
    createGameWinnerDisplayHeaderElement();
    let playerOneTurnDisplayElement = createPlayerOneTurnDisplayElement();
    let playerTwoTurnDisplayElement = createPlayerTwoDisplayElement();

    gameController(playerOneTurnDisplayElement, playerTwoTurnDisplayElement );
   

};

const GameBoardNode = function Node(id, value = "") {

    let isMarked = false;
    const getId = () => id;
    const getValue = () => value;
    const getMark = () => isMarked;
    const resetMark = () => isMarked = false;
    const resetValue = () => value = "";
    const changeValue = x => {
        value = x;
        isMarked = true;}
    
    return {getId, getValue, getMark, changeValue, resetMark, resetValue};
};

const Player = (name, signature) => {
    
    let isPlayed = false;
    let score = 0;
    const getSignature = () => signature;
    const getPlayStatus = () => isPlayed;
    const getName = () => name;
    const getScore = () => score;
    const incrementPlayerScore = () => ++score;
    const resetScore = () => score = 0;
    return {getSignature, getPlayStatus, getScore, incrementPlayerScore, getName, resetScore};
}

function addEventListenerToForm() {
    const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", handleSubmit);
    
}
function handleSubmit(e){

    e.preventDefault();
    const { playerOneInputForm, playerTwoInputForm } = getFormData();
    createPlayersFromFormData(playerOneInputForm, playerTwoInputForm);
    clearFormData(playerOneInputForm, playerTwoInputForm);
    createGameBoard();
}

const gameController = (playerOneTurnDisplay, playerTwoTurnDisplay) => {

    let moveCount = 0;
    let roundCount = 1;
    let roundEnded = false;
    let currentPlayer = playerOne;
    let gameEnded = false;

    if(!gameEnded){
        const newRoundButton = getNewRoundButtonByClass();
        newRoundButton.addEventListener("click", startNewRound);

        togglePlayerOnesTurnDisplay(playerOneTurnDisplay);
        toggleBoardNodeClickEventListeners(true);
    
        function changeNodeValue(e) {
            if(gameEnded) return;

            let targetGameNode = gameBoardArray[(e.target.id)[0]][(e.target.id)[1]];
            if ( targetGameNode.getMark()) return;

            changeDomElementsValue(targetGameNode, e);

            moveCount++;

            
            checkRoundEndConditions(targetGameNode.getValue(),(e.target.id)[0],(e.target.id)[1]);
            checkGameEndConditions(playerOne, playerTwo);
            
            currentPlayer = changeCurrentPlayer(roundEnded, currentPlayer);
        }

        function changeDomElementsValue(targetGameNode, e) {
            targetGameNode.changeValue(currentPlayer.getSignature());
            e.target.textContent = currentPlayer.getSignature();
        }

        function toggleBoardNodeClickEventListeners(newRound){
            const boardNodes = Array.from(document.querySelectorAll(".board-node"));
        
            newRound ? boardNodes.forEach(node => node.addEventListener("click", changeNodeValue)):
            boardNodes.forEach(node => node.removeEventListener("click", changeNodeValue));
        }
        
        
        function changeCurrentPlayer(roundEnded, currentPlayer) {
            if (!roundEnded) {
                if (currentPlayer.getName() == playerOne.getName()) {
                    currentPlayer = playerTwo;
                    togglePlayerTwosTurnDisplay(playerTwoTurnDisplay);
                    togglePlayerOnesTurnDisplay(playerOneTurnDisplay);
                }
                else {
                    currentPlayer = playerOne;
                    togglePlayerOnesTurnDisplay(playerOneTurnDisplay);
                    togglePlayerTwosTurnDisplay(playerTwoTurnDisplay);

                }
            }
            return currentPlayer;
        }

        function checkRoundEndConditions(nodeValue, currentRow, currentColumn ){
            if(gameEnded)return;
            const totalRowsAndColumns = 3;
            //check row
            for(let i = 0; i < totalRowsAndColumns; i++){
                if(gameBoardArray[currentRow][i].getValue() != nodeValue)
                {
                    roundEnded = false;
                    break;}
                if(i == totalRowsAndColumns-1){
                    handleRoundWinConditions();
                    return;
                }
            }
            //check col
            for(let i = 0; i < totalRowsAndColumns; i++){
                if(gameBoardArray[i][currentColumn].getValue() != nodeValue)
                {
                    roundEnded = false;
                    break;}
                if(i == totalRowsAndColumns-1){
                    handleRoundWinConditions();
                    return;
                }
            }
            //check diag
            if(currentRow == currentColumn){
                //we're on a diagonal
                for(let i = 0; i < totalRowsAndColumns; i++){
                    if(gameBoardArray[i][i].getValue() != nodeValue){
                        roundEnded = false;
                        break;
                    }
                    if(i == totalRowsAndColumns-1){
                        handleRoundWinConditions();
                        return;
                    }
                }
            }
            //check anti diag
            if((+currentRow) + (+currentColumn) == totalRowsAndColumns - 1){
                for(let i = 0; i < totalRowsAndColumns; i++){
                    if(gameBoardArray[i][(totalRowsAndColumns-1)-i].getValue() != nodeValue)
                    {
                        roundEnded = false;
                        break;
                    }
                    if(i == totalRowsAndColumns-1){
                        handleRoundWinConditions();
                    }
                }
            }
            //check draw
            if(moveCount == (Math.pow(totalRowsAndColumns, 2) - 1)){
                handleRoundDrawConditions();
                return;
            }

            function handleRoundDrawConditions() {
                console.log("It's a draw.");
                roundCount++;
                roundEnded = true;
                changeRoundWinnerDisplayHeaderText(currentPlayer, true);
                resetCurrentPlayer();
                resetMoveCount();
                resetPlayersTurnDisplay(playerOneTurnDisplay, playerTwoTurnDisplay);
                updateScoreTextDisplay();
                toggleBoardNodeClickEventListeners(false);
                toggleNewRoundButtonClass(); //button visible
            }

            function handleRoundWinConditions() {
               
                currentPlayer.incrementPlayerScore();
                roundCount++;
                roundEnded = true;
                changeRoundWinnerDisplayHeaderText(currentPlayer, false);
                resetCurrentPlayer();
                resetMoveCount();
                updateScoreTextDisplay();
                toggleBoardNodeClickEventListeners(false);
                resetPlayersTurnDisplay(playerOneTurnDisplay, playerTwoTurnDisplay);
                toggleNewRoundButtonClass();   //button visible
            }
        }

        function checkGameEndConditions(firstPlayer, secondPlayer){
            switch(true) {
                case (firstPlayer.getScore() == 3 && secondPlayer.getScore()== 0 ):
                    changeGameWinnerDisplayHeaderText(firstPlayer);
                    toggleBoardNodeClickEventListeners(false);
                    hideNewRoundButtonClassById();
                    toggleNewGameButtonClass();
                    gameEnded = true;
                    break;
                case ( secondPlayer.getScore() == 3 && firstPlayer.getScore()== 0 ):
                    changeGameWinnerDisplayHeaderText(secondPlayer);
                    toggleBoardNodeClickEventListeners(false);
                    hideNewRoundButtonClassById();
                    toggleNewGameButtonClass();
                    gameEnded = true;
                    break;
                case ( roundCount > 5 ):
                    toggleBoardNodeClickEventListeners(false);
                    firstPlayer.getScore() > secondPlayer.getScore() ? 
                    changeGameWinnerDisplayHeaderText(firstPlayer):
                    changeGameWinnerDisplayHeaderText(secondPlayer);
                    hideNewRoundButtonClassById();
                    toggleNewGameButtonClass();
                    gameEnded = true;
                    break;
                default:
                    break;
            }
            
        }

    
        function resetCurrentPlayer(){
            currentPlayer = playerOne;
        }
        function resetMoveCount(){
            moveCount = 0;
        }
        function startNewRound(e){
            e.target.classList.toggle("new-round-button");
            clearBoard(); //locl scope
            toggleBoardNodeClickEventListeners(true);
            updateRoundDisplay(roundCount);
            hideRoundWinnderDisplayHeaderText();
        }
        function updateRoundDisplay(roundCount) {
            let roundText = document.querySelector("#round");
            roundText.textContent = `Round: ${roundCount}`;
        }
    }
}


function createPlayersFromFormData(playerOneInputForm, playerTwoInputForm) {
    playerOne = Player(playerOneInputForm.value, "X");
    playerTwo = Player(playerTwoInputForm.value, "O");
}

function getFormData() {
    const playerOneInputForm = document.querySelector("#player-one");
    const playerTwoInputForm = document.querySelector("#player-two");
    return { playerOneInputForm, playerTwoInputForm };
}

function clearFormData(playerOneInputForm, playerTwoInputForm) {
    const form = document.querySelector(".form-container");
    form.style.display = "none";
    playerOneInputForm.value = "";
    playerTwoInputForm.value = "";
}

function updateScoreTextDisplay(){  
    
    let playerOneScoreText = document.querySelector("#player-one-score-text");
    let playerTwoScoreText = document.querySelector("#player-two-score-text");
    playerOneScoreText.textContent = playerOne.getScore();
    playerTwoScoreText.textContent = playerTwo.getScore();
}



function createBoardMatrix( rows, cols, arr){
        
    // Creates all lines:
    for(var i=0; i < rows; i++){
  
        // Creates an empty line
        arr.push([]);
  
        // Adds cols to the empty line:
        arr[i].push( new Array(cols));
    }
  
    return arr;
}

function clearBoard(){
    gameBoardArray.forEach(nodeGroup => { nodeGroup.forEach(node => {
        node.resetMark();
        node.resetValue();
    })});

    let boardNodes = Array.from(document.querySelectorAll(".board-node"));
    boardNodes.forEach(x => x.textContent = "");
    
}

function createPlayerOneTurnDisplayElement(){
    
    let playerOnesTurnDisplayElement = document.createElement("h2");
    playerOnesTurnDisplayElement.textContent = `${playerOne.getName()} is playing`;
    playerOnesTurnDisplayElement.classList.add("playeronesturndisplayelement");
    let playerOneParent = document.querySelector(".player-one-display")
    playerOneParent.appendChild(playerOnesTurnDisplayElement);
    return playerOnesTurnDisplayElement;
}
function createPlayerTwoDisplayElement(){
    
    let playerTwosTurnDisplayElement = document.createElement("h2");
    playerTwosTurnDisplayElement.textContent = `${playerTwo.getName()} is playing`;
    playerTwosTurnDisplayElement.classList.add("playertwosturndisplayelement");
    let playerTwoParent = document.querySelector(".player-two-display")
    playerTwoParent.appendChild(playerTwosTurnDisplayElement);
    return playerTwosTurnDisplayElement;
}

function togglePlayerOnesTurnDisplay(playerOnesDisplay) {
    playerOnesDisplay.classList.toggle("playeronesturndisplayelement");
}
     
function togglePlayerTwosTurnDisplay(playerTwosDisplay) {
    playerTwosDisplay.classList.toggle("playertwosturndisplayelement");
}

function resetPlayersTurnDisplay(playerOnesDisplay, playerTwosDisplay ){
    playerOnesDisplay.classList.remove("playeronesturndisplayelement");
    playerTwosDisplay.classList.add("playertwosturndisplayelement");
}

const getNewRoundButtonByClass = () => document.querySelector(".new-round-button");
const getNewRoundButtonByType = () => document.querySelector("#new-round-button");

function toggleNewRoundButtonClass(){
    let newRoundButton = getNewRoundButtonByClass();
    if(!newRoundButton)return;
    newRoundButton.classList.toggle("new-round-button");
    
}
function hideNewRoundButtonClassById(){
    let newRoundButton = getNewRoundButtonByType();
    newRoundButton.style.display = "none";
}

const getNewGameButtonByClass = () => document.querySelector(".new-game-button");

function toggleNewGameButtonClass(){
    let newGameButton = getNewGameButtonByClass();
    if(!newGameButton)return;
    newGameButton.classList.toggle("new-game-button");
}




function createRoundWinnerDisplayHeaderElement(){

    let roundWinnerDisplayHeader = document.createElement("h2");
    roundWinnerDisplayHeader.classList.add("winner-display-header");
    let winnerDisplayHeaderParent = document.querySelector(".main-game-container");
    winnerDisplayHeaderParent.appendChild(roundWinnerDisplayHeader);
}
function changeRoundWinnerDisplayHeaderText(winner, isDrawRound){
    
    let roundWinnerDisplayHeader = document.querySelector(".winner-display-header");
    roundWinnerDisplayHeader.style.display = "block";
    if(isDrawRound){
        roundWinnerDisplayHeader.textContent = "It's draw!"
    }else{
        roundWinnerDisplayHeader.textContent = `${winner.getName()} has won the round!`;
    }
}
function hideRoundWinnderDisplayHeaderText(){
    let roundWinnerDisplayHeader = document.querySelector(".winner-display-header");
    roundWinnerDisplayHeader.style.display = "none";
}

function createGameWinnerDisplayHeaderElement(){

    let gameWinnerDisplayHeader = document.createElement("h2");
    gameWinnerDisplayHeader.classList.add("game-winner-display-header");
    let gameWinnerDisplayHeaderParent = document.querySelector(".main-game-container");
    gameWinnerDisplayHeaderParent.appendChild(gameWinnerDisplayHeader);
}
function changeGameWinnerDisplayHeaderText(winner){
    
    let gameWinnerDisplayHeader = document.querySelector(".winner-display-header");
    gameWinnerDisplayHeader.style.display = "block";
    gameWinnerDisplayHeader.textContent = `Game is over! ${winner.getName()} has won!`;
}

addEventListenerToForm();


