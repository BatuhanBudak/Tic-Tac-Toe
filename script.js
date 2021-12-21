let playerOne;
let playerTwo;
let gameBoardArray = [];

const createGameBoard = function(){
    
    
    const boardRowAndColumnLength = 3; //Fixed game board 
    const gameBoardContainer = document.querySelector(".game-board-container");
    gameBoardContainer.style.display = "flex";
    
    function matrix( rows, cols, arr){
        
        // Creates all lines:
        for(var i=0; i < rows; i++){
      
            // Creates an empty line
            arr.push([]);
      
            // Adds cols to the empty line:
            arr[i].push( new Array(cols));
        }
      
      return arr;
      }
      

    function _populateGameBoardArray() {

        gameBoardArray =  matrix(3, 3, gameBoardArray)

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
    const totalRowsAndColumns = 3;
    let currentPlayer = playerOne;

    const boardNodes = Array.from(document.querySelectorAll(".board-node"));
    boardNodes.forEach(node => node.addEventListener("click", changeNodeValue));
  
    function changeNodeValue(e) {

        let targetGameNode = gameBoardArray[(e.target.id)[0]][(e.target.id)[1]];
        if ( targetGameNode.getMark()) return;

        targetGameNode.changeValue(currentPlayer.getSignature());
        e.target.textContent = currentPlayer.getSignature();

        currentPlayer.changePlayStatus(); //Doesnt do anything
        
        if( currentPlayer.getName() == playerOne.getName()) {
            currentPlayer = playerTwo;}
        else {
            currentPlayer = playerOne;
        }

        moveCount++;
        checkRoundEndConditions(targetGameNode.getValue(),(e.target.id)[0],(e.target.id)[1]);
        checkGameEndConditions(playerOne, playerTwo);
    }

    function checkRoundEndConditions(nodeValue, currentRow, currentColumn ){
        //check col
        for(let i = 0; i < totalRowsAndColumns; i++){
            if(gameBoardArray[currentRow][i].getValue() != nodeValue)
            {
                
                break;}
            if(i == totalRowsAndColumns-1){
                console.log(currentPlayer.getName() + "has won!")
                currentPlayer.incrementPlayerScore();
                roundCount++;
                clearBoard();
            }
        }
        //check row
        for(let i = 0; i < totalRowsAndColumns; i++){
            if(gameBoardArray[i][currentColumn].getValue() != nodeValue)
            {
                
                break;}
            if(i == totalRowsAndColumns-1){
                console.log(currentPlayer.getName() + "has won!")
                currentPlayer.incrementPlayerScore();
                roundCount++;
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
                    clearBoard();
                }
            }
        }
        //check draw
        if(moveCount == (Math.pow(totalRowsAndColumns, 2) - 1)){
            console.log("It's a draw.")
            roundCount++;
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
        })
        });
        let boardNodes = Array.from(document.querySelectorAll(".board-node"));
        boardNodes.forEach(x => x.textContent = "");

        currentPlayer = playerOne;
        moveCount = 0;
    }

}



createPlayers();
