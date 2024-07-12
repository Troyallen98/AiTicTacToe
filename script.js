document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const newGameButton = document.getElementById('new-game');

    let gameState = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];
    let currentPlayer = 'X';

    const renderBoard = () => {
        board.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.textContent = gameState[i][j];
                cell.addEventListener('click', () => makeMove(i, j));
                board.appendChild(cell);
            }
        }
    };

    const makeMove = (row, col) => {
        if (gameState[row][col] === ' ' && checkWinner() === null) {
            gameState[row][col] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            renderBoard();
            checkGameStatus();
            if (currentPlayer === 'O') {
                fetch('/api/move', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ board: gameState })
                })
                .then(response => response.json())
                .then(data => {
                    const { row, col } = data;
                    if (row !== null && col !== null) {
                        gameState[row][col] = 'O';
                        currentPlayer = 'X';
                        renderBoard();
                        checkGameStatus();
                    }
                });
            }
        }
    };

    const checkGameStatus = () => {
        const winner = checkWinner();
        if (winner) {
            alert(`${winner} wins!`);
        } else if (gameState.flat().every(cell => cell !== ' ')) {
            alert('It\'s a draw!');
        }
    };

    const checkWinner = () => {
        // Check rows, columns, and diagonals for a winner
        // Return 'X', 'O', or null
    };

    newGameButton.addEventListener('click', () => {
        gameState = [
            [' ', ' ', ' '],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
        currentPlayer = 'X';
        renderBoard();
    });

    renderBoard();
});
