const createGameBoard = function(){
    
    let gameBoardArray = [];
    const boardLength = 9; //Fixed game board 
    const gameBoardContainer = document.querySelector(".game-board-container");
    gameBoardContainer.style.display = "flex";
    
    function _populateGameBoardArray() {

       for (let index = 0; index < boardLength; index++) {
        gameBoardArray.push(GameBoardNode(index));}
    }
  
    function _populateGameBoardContainer ()  {
        for (let i = 0; i < gameBoardArray.length; i++) {

            let boardNode = document.createElement("div");
            boardNode.classList.add("board-node");
            boardNode.addEventListener("click", gameController.changeNodeValue)
            boardNode.id = gameBoardArray[i].getId();
            gameBoardContainer.appendChild(boardNode);
        }
    }
    
    _populateGameBoardArray();
    _populateGameBoardContainer();
    

};

const GameBoardNode = function Node(id, value = "") {

    let isMarked = false;
    const getId = () => id;
    const getValue = () => value;
    const getMark = () => isMarked;
    const changeValue = x => {
        value = x;
        isMarked = true;}
    
    return {getId, getValue, getMark,changeValue};
};

const Player = (name, signature) => {
    
    let isPlayed = false;
    let score = 0;
    const getSignature = () => signature;
    const getPlayStatus = () => isPlayed;
    const changePlayStatus = () => this.getPlayStatus() = !this.getPlayStatus();
    const getScore = () => score;
    const incrementPlayerScore = () => ++this.score;
    return {getSignature, getPlayStatus, changePlayStatus, getScore, incrementPlayerScore};
}

function createPlayers() {
    let playerOne;
    let playerTwo;
    
    
    const submitButton = document.querySelector("#submit");
    submitButton.addEventListener("click", handleSubmit);
        
    

}
function handleSubmit(e){
    e.preventDefault();
    const playerOneInputForm = document.querySelector("#player-one");
    const playerTwoInputForm = document.querySelector("#player-two");
    const form = document.querySelector(".form-container"); 
    playerOne = Player(playerOneInputForm.value, "X");
    playerTwo = Player(playerTwoInputForm.value, "O");
    
    form.style.display = "none";
    createGameBoard();
    playerOneInputForm.value ="";
    playerTwoInputForm.value ="";
    return {playerOne, playerTwo};

}

const gameController = () => {
    let currentPlayer = createPlayers.playerOne;
    
    if(currentPlayer=== createPlayers.playerOne && createPlayers.playerOne.getPlayStatus()){
        currentPlayer = createPlayers.playerTwo;
    }
    
    else if(currentPlayer=== createPlayers.playerTwo && createPlayers.playerTwo.getPlayStatus()){
        currentPlayer = createPlayers.playerOne;
    }

    function changeNodeValue(e) {
        
        if(e.target.getMark()) return;
        e.target.changeValue(currentPlayer.getSignature());
        currentPlayer.changePlayStatus();

        //render()
        
    }
    
  return {changeNodeValue}  
  
}
createPlayers();



