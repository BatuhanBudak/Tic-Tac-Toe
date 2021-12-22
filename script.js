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
  
    function _populateGameBoardContainer ()  {
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
    _populateGameBoardContainer();
    createPlayersNamesHeaders();
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
    return {getSignature, getPlayStatus, getScore, incrementPlayerScore, getName};
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
    togglePlayerOnesTurnDisplay(playerOneTurnDisplay);
    toggleBoardNodeClickEventListeners(true);
  
    function changeNodeValue(e) {

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
        const totalRowsAndColumns = 3;
        //check row
        for(let i = 0; i < totalRowsAndColumns; i++){
            if(gameBoardArray[currentRow][i].getValue() != nodeValue)
            {
                roundEnded = false;
                break;}
            if(i == totalRowsAndColumns-1){
                handleRoundWinValuables();
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
                handleRoundWinValuables();
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
                    handleRoundWinValuables();
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
                    handleRoundWinValuables();
                }
            }
        }
        //check draw
        if(moveCount == (Math.pow(totalRowsAndColumns, 2) - 1)){
            handleRoundDrawValuables();
            return;
        }

        function handleRoundDrawValuables() {
            console.log("It's a draw.");
            roundCount++;
            roundEnded = true;
            updateScoreAndTextDisplay(roundCount);
            clearBoard(playerOneTurnDisplay, playerTwoTurnDisplay);
        }

        function handleRoundWinValuables() {
            console.log(currentPlayer.getName() + "has won!");
            currentPlayer.incrementPlayerScore();
            roundCount++;
            roundEnded = true;
            updateScoreAndTextDisplay(roundCount);
            clearBoard(playerOneTurnDisplay, playerTwoTurnDisplay);
        }
    }

    function checkGameEndConditions(firstPlayer, secondPlayer){
        switch(true) {
            case (firstPlayer.getScore() == 3 && secondPlayer.getScore()== 0 ):
                console.log("Game over." + `${firstPlayer.getName()} has won!`)
                toggleBoardNodeClickEventListeners(false);
                break;
            case ( secondPlayer.getScore() == 3 && firstPlayer.getScore()== 0 ):
                console.log("Game over." + `${secondPlayer.getName()} has won!`);
                toggleBoardNodeClickEventListeners(false);
                break;
            case ( roundCount > 5 ):
                firstPlayer.getScore() > secondPlayer.getScore() ? 
                console.log("Game over." + `${firstPlayer.getName()} has won!`):
                console.log("Game over." + `${secondPlayer.getName()} has won!`);
                toggleBoardNodeClickEventListeners(false);
                break;
            default:
                break;
        }
    }

    function clearBoard(playerOnesTurnDisplayElement, playerTwosTurnDisplayElement){
        gameBoardArray.forEach(nodeGroup => { nodeGroup.forEach(node => {
            node.resetMark();
            node.resetValue();
        })});

        let boardNodes = Array.from(document.querySelectorAll(".board-node"));
        boardNodes.forEach(x => x.textContent = "");

        currentPlayer = playerOne;
        moveCount = 0;
        clearPlayersTurnDisplay(playerOnesTurnDisplayElement, playerTwosTurnDisplayElement);
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

function updateScoreAndTextDisplay(round){  //currentPlaying'i yeni fon a argument olara ata?
    
    let playerOneScoreText = document.querySelector("#player-one-score-text");
    let playerTwoScoreText = document.querySelector("#player-two-score-text");
    let roundText = document.querySelector("#round");
    playerOneScoreText.textContent = playerOne.getScore();
    playerTwoScoreText.textContent = playerTwo.getScore();
    
    roundText.textContent = `Round: ${round}`;
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

//TODO bunun yerine html'e add yap ve toggle yap sıraya gore
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

function clearPlayersTurnDisplay(playerOnesDisplay, playerTwosDisplay ){
    playerOnesDisplay.classList.remove("playeronesturndisplayelement");
    playerTwosDisplay.classList.add("playertwosturndisplayelement");
}


addEventListenerToForm();


