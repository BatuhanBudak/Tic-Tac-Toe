let playerOne;
let playerTwo;
let gameBoardArray = [];

const createGameBoard = function(){
    
    
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
            boardNode.textContent = "";
            boardNode.id = gameBoardArray[i].getId();
            gameBoardContainer.appendChild(boardNode);
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
    const changeValue = x => {
        value = x;
        isMarked = true;}
    
    return {getId, getValue, getMark, changeValue};
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
    const incrementPlayerScore = () => ++this.score;
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

    let currentPlayerName = playerOne.getName();
    let currentPlayer = playerOne;
    const boardNodes = Array.from(document.querySelectorAll(".board-node"));
    boardNodes.forEach(node => node.addEventListener("click", changeNodeValue));
       
    
   /*while (true){
        if(currentPlayer.name === playerOne.getName() && !currentPlayer.getPlayStatus()){

        }

        else if(currentPlayer=== playerTwo.getName() && !currentPlayer.getPlayStatus()){

        }
    }*/
    function changeNodeValue(e) {

        let targetGameNode = gameBoardArray[e.target.id];
        if(targetGameNode.getMark()) return;
        targetGameNode.changeValue(currentPlayer.getSignature());
        e.target.textContent = currentPlayer.getSignature();
        currentPlayer.changePlayStatus();
        if( currentPlayer.getName() == playerOne.getName()) {
            currentPlayer = playerTwo;}
        else {
            currentPlayer = playerOne;
        }
        //render()
        
    }
}


createPlayers();
