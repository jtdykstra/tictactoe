// only one game board
const gameBoard = (() => {
    const BOARD_SIZE = 3;
    let disabled = false;

    const board = [
        ['','',''],
        ['','',''],
        ['','','']
    ]

    const getBoardSize = () => {
        return BOARD_SIZE;
    };

    const setBoardPos = (target, value) => {
        x = Number(target.getAttribute('data-x'));
        y = Number(target.getAttribute('data-y'));
        if (!disabled && board[x][y] === '') {
            board[x][y] = value; 
            return true;
        }
        return false;
    } 

    const renderGrid = (parent, clickHandler) => {
        const container = document.createElement('div');
        container.id = 'board-container';
        
        for (let xVal = 0; xVal < BOARD_SIZE; ++xVal)
        {
            for (let yVal = 0; yVal < BOARD_SIZE; ++yVal)
            {
                let colEntry = document.createElement('p');
                colEntry.setAttribute('data-x', xVal);
                colEntry.setAttribute('data-y', yVal);
                colEntry.innerText = board[xVal][yVal];
                colEntry.addEventListener('click', clickHandler);
                container.appendChild(colEntry);
            }
        }
         
        const boardElement = document.getElementById('board-container');
        if (boardElement) {
            parent.removeChild(boardElement);
        }
        parent.appendChild(container);
    };

    const disableBoard = () => {
        disabled = true;
    }
    
    const checkForWin = (target, mark) => {
        x = target.getAttribute('data-x');
        y = target.getAttribute('data-y');
        
        let rowCheck = true;
        let colCheck = true;
        let diagCheck = true;
        let cdiagCheck = true;
        
        // check row
        for (let colInd = 0; colInd < BOARD_SIZE; ++colInd) {
            if (board[x][colInd] != mark)
                rowCheck = false;
        }

        // check col
        for (let rowInd = 0; rowInd < BOARD_SIZE; ++rowInd)
        {
            if (board[rowInd][y] != mark)
                colCheck = false;
        }

        // check diag
        for (let ind = 0; ind < BOARD_SIZE; ++ind)
        {
            if (board[ind][ind] != mark)
                diagCheck = false;
        }

        // check counter diag
        for (let ind = 0; ind < BOARD_SIZE; ++ind)
        {
            if (board[BOARD_SIZE - ind - 1][ind] != mark)
                cdiagCheck = false;
        }
        
        if (rowCheck || colCheck || diagCheck || cdiagCheck)
        {
            disableBoard();
            return mark;
        }
        return '';
    }
    
    const resetBoard = () => {
        for (let xInd = 0; xInd < BOARD_SIZE; ++xInd) {
            for (let yInd = 0; yInd < BOARD_SIZE; ++yInd) {
                board[xInd][yInd] = '';
            }
        }
        disabled = false;
    }

    return {
        getBoardSize,
        setBoardPos,
        disableBoard,
        renderGrid,
        checkForWin,
        resetBoard,
    };
})();

// only one game flow
const gameFlow  = (() => {
    let playerOne = null;
    let playerTwo = null;
    let currentPlayer = null;
    let moveCount = 0;

    const gameStart = () => {
        playerOne = player('jordan', 'o');
        playerTwo = player('Laura', 'x');
        currentPlayer = playerOne;
        const primaryContainer = document.getElementById('main-container');
        gameBoard.renderGrid(primaryContainer, clickHandler);
    }

    const showWinMessage = (mark) => {
        const primaryContainer = document.getElementById('main-container');
        const endOfGameMessage = document.createElement('h1');
        endOfGameMessage.innerText = `${mark} has won the game!`; 
        primaryContainer.appendChild(endOfGameMessage);

    }

    const showTieMessage = () => {
        const primaryContainer = document.getElementById('main-container');
        const endOfGameMessage = document.createElement('h1');
        endOfGameMessage.innerText = `tie game!`; 
        primaryContainer.appendChild(endOfGameMessage);
    }
    
    const newGameHandler = () => {
        currentPlayer = playerOne;
        moveCount = 0;
        gameBoard.resetBoard();
        const primaryContainer = document.getElementById('main-container');
        while (primaryContainer.firstChild) {
            primaryContainer.removeChild(primaryContainer.lastChild);
        }
        gameBoard.renderGrid(primaryContainer, clickHandler);
    }

    const displayEndOfGameButtons = () => {
        const primaryContainer = document.getElementById('main-container');
        const playAgainButton = document.createElement('button');
        playAgainButton.innerText = 'play again';
        playAgainButton.addEventListener('click', newGameHandler);
        primaryContainer.appendChild(playAgainButton);
    }

    const clickHandler = (e) => {
        let result = gameBoard.setBoardPos(e.target, currentPlayer.getPlayerMark());
        
        // only make a move if the click was valid
        if (result) {
            const primaryContainer = document.getElementById('main-container');
            gameBoard.renderGrid(primaryContainer, clickHandler);
            let result = gameBoard.checkForWin(e.target, currentPlayer.getPlayerMark());
            if (result != '') {
                showWinMessage(currentPlayer.getPlayerMark());
                displayEndOfGameButtons();
            }
            else {
                nextPlayer();
            } 
        }
        e.preventDefault();
    }

    const nextPlayer = () => {
        currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
        ++moveCount;
        if (moveCount === (gameBoard.getBoardSize() * gameBoard.getBoardSize())) 
        {
            gameBoard.disableBoard();
            showTieMessage();
            displayEndOfGameButtons();
        }
    }

    return {gameStart};
})();

// multiple players, using factory function
const player = (name, mark) => {
    let playerName = name; 
    let playerMark = mark;
    
    const getPlayerMark = () => {
        return playerMark;
    }

    const getPlayerName = () => {
        return playerName;
    }

    return {getPlayerMark, getPlayerName};
};

// start the game
gameFlow.gameStart();
