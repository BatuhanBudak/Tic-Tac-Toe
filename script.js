let playerOne;
let playerTwo;
let gameBoardArray = [];

const createGameBoard = function(){
    
    
    const boardRowAndColumnLength = 3; //Fixed game board 
    const gameBoardContainer = document.querySelector(".game-board-container");
    const mainGameContainer = document.querySelector(".main-game-container");
    mainGameContainer.style.display = "flex";

    

    function CreatePlayerNameHeaders() {
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

        gameBoardArray =  createMatrix(3, 3, gameBoardArray)

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
    CreatePlayerNameHeaders();

    gameController();
   

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
    const changePlayStatus = () => {
        isPlayed = !getPlayStatus();
    }
    const getScore = () => score;
    const incrementPlayerScore = () => ++score;
    return {getSignature, getPlayStatus, changePlayStatus, getScore, incrementPlayerScore, getName};
}

function createPlayers() {
    
    
    const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", handleSubmit);
   
    
}
function handleSubmit(e){

    e.preventDefault();
    const playerOneInputForm = document.querySelector("#player-one");
    const playerTwoInputForm = document.querySelector("#player-two");
    playerOne = Player(playerOneInputForm.value, "X");
    playerTwo = Player(playerTwoInputForm.value, "O");
    const form = document.querySelector(".form-container"); 
    form.style.display = "none";
    playerOneInputForm.value ="";
    playerTwoInputForm.value ="";
    createGameBoard();
}

const gameController = () => {

    let moveCount = 0;
    let roundCount = 0;
   
    let currentPlayer = playerOne;

    const boardNodes = Array.from(document.querySelectorAll(".board-node"));
    boardNodes.forEach(node => node.addEventListener("click", changeNodeValue));
  
    function changeNodeValue(e) {

        let targetGameNode = gameBoardArray[(e.target.id)[0]][(e.target.id)[1]];
        if ( targetGameNode.getMark()) return;

        targetGameNode.changeValue(currentPlayer.getSignature());
        e.target.textContent = currentPlayer.getSignature();

        currentPlayer.changePlayStatus(); //Doesnt do anything
        
        moveCount++;
        checkRoundEndConditions(targetGameNode.getValue(),(e.target.id)[0],(e.target.id)[1]);
        checkGameEndConditions(playerOne, playerTwo);
        if( currentPlayer.getName() == playerOne.getName()) {
            currentPlayer = playerTwo;}
        else {
            currentPlayer = playerOne;
        }
    }

    function checkRoundEndConditions(nodeValue, currentRow, currentColumn ){
        const totalRowsAndColumns = 3;
        //check row
        for(let i = 0; i < totalRowsAndColumns; i++){
            if(gameBoardArray[currentRow][i].getValue() != nodeValue)
            {
                
                break;}
            if(i == totalRowsAndColumns-1){
                console.log(currentPlayer.getName() + "has won!")
                currentPlayer.incrementPlayerScore();
                roundCount++;
                updateDisplay();
                clearBoard();
            }
        }
        //check col
        for(let i = 0; i < totalRowsAndColumns; i++){
            if(gameBoardArray[i][currentColumn].getValue() != nodeValue)
            {
                
                break;}
            if(i == totalRowsAndColumns-1){
                console.log(currentPlayer.getName() + "has won!")
                currentPlayer.incrementPlayerScore();
                roundCount++;
                updateDisplay();
                clearBoard();
            }
        }
        //check diag
        if(currentRow == currentColumn){
            //we're on a diagonal
            for(let i = 0; i < totalRowsAndColumns; i++){
                if(gameBoardArray[i][i].getValue() != nodeValue){
                    break;
                }
                if(i == totalRowsAndColumns-1){
                    console.log(currentPlayer.getName() + "has won!")
                    currentPlayer.incrementPlayerScore();
                    roundCount++;
                    updateDisplay();
                    clearBoard();
                }
            }
        }
        //check anti diag
        if(currentRow + currentColumn == totalRowsAndColumns - 1){
            for(let i = 0; i < totalRowsAndColumns; i++){
                if(gameBoardArray[i][(totalRowsAndColumns-1)-i].getValue() != nodeValue)
                {
                    break;
                }
                if(i == totalRowsAndColumns-1){
                    console.log(currentPlayer.getName() + "has won!")
                    currentPlayer.incrementPlayerScore();
                    roundCount++;
                    updateDisplay();
                    clearBoard();
                }
            }
        }
        //check draw
        if(moveCount == (Math.pow(totalRowsAndColumns, 2) - 1)){
            console.log("It's a draw.")
            roundCount++;
            updateDisplay();
            clearBoard();

        }
    }

    function checkGameEndConditions(firstPlayer, secondPlayer){
        switch(true) {
            case (firstPlayer.getScore() == 3 && secondPlayer.getScore()== 0 ):
                console.log("Game over." + `${firstPlayer.getName()} has won!`)
                break;
            case ( secondPlayer.getScore() == 3 && firstPlayer.getScore()== 0 ):
                console.log("Game over." + `${secondPlayer.getName()} has won!`)
                break;
            case ( roundCount >= 5 ):
                firstPlayer.getScore() > secondPlayer.getScore() ? 
                console.log("Game over." + `${firstPlayer.getName()} has won!`):
                console.log("Game over." + `${secondPlayer.getName()} has won!`);
                break;
            default:
                break;
        }
    }

    function clearBoard(){
        gameBoardArray.forEach(nodeGroup => { nodeGroup.forEach(node => {
            node.resetMark();
            node.resetValue();
        })});

        let boardNodes = Array.from(document.querySelectorAll(".board-node"));
        boardNodes.forEach(x => x.textContent = "");

        currentPlayer = playerOne;
        moveCount = 0;
    }
}

function updateDisplay(){
    
    let playerOneScoreText = document.querySelector("#player-one-score-text");
    let playerTwoScoreText = document.querySelector("#player-two-score-text");
    playerOneScoreText.textContent = playerOne.getScore();
    playerTwoScoreText.textContent = playerTwo.getScore();
}

function createMatrix( rows, cols, arr){
        
    // Creates all lines:
    for(var i=0; i < rows; i++){
  
        // Creates an empty line
        arr.push([]);
  
        // Adds cols to the empty line:
        arr[i].push( new Array(cols));
    }
  
    return arr;
  }



createPlayers();
