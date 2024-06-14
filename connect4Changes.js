class Game {
    constructor(HEIGHT, WIDTH, playerOne, playerTwo) {
        this.HEIGHT = HEIGHT;
        this.WIDTH = WIDTH;
        this.players = [playerOne, playerTwo];
        this.currPlayer = playerOne; //changed so it keeps track of the current player object instead of number
        //this.board = []; //moved to makeBoard method
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false;
        
    }

    makeBoard() {
        this.board = [];
        for (let y = 0; y < this.HEIGHT; y++) {
          this.board.push(Array.from({ length: this.WIDTH }));
        }
    }

    makeHtmlBoard() {
        const board = document.getElementById('board');
        
        board.innerHTML = ''; //added after viewing solution

        // make column tops (clickable area for adding a piece to that column)
        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        this.handleBoardClick = this.handleClick.bind(this);
        top.addEventListener('click', this.handleBoardClick);
      
        for (let x = 0; x < this.WIDTH; x++) {
          const headCell = document.createElement('td');
          headCell.setAttribute('id', x);
          top.append(headCell);
        }
      
        board.append(top);
      
        // make main part of board
        for (let y = 0; y < this.HEIGHT; y++) {
          const row = document.createElement('tr');
      
          for (let x = 0; x < this.WIDTH; x++) {
            const cell = document.createElement('td');
            cell.setAttribute('id', `${y}-${x}`);
            row.append(cell);
          }
      
          board.append(row);
        }
    }

    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color;
        //piece.classList.add(`${this.currPlayer}`); //this line is completely taken out in the solution
        piece.style.top = -50 * (y + 2);
      
        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {
        alert(msg);
        //added after viewing the solution:
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleBoardClick);

    }

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;
      
        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
          return;
        }
      
        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);
        
        // check for win
        if (this.checkForWin()) {
          return this.endGame(`${this.currPlayer.color} won!`);
        }
        
        // check for tie
        if (this.board.every(row => row.every(cell => cell))) {
          return this.endGame('Tie!');
        }
          
        // switch players
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0]; // this.playerOne ? this.playerTwo : this.playerOne;
    }

    checkForWin() {
        function _win(cells) {
          // Check four cells to see if they're all color of current player
          //  - cells: list of four (y, x) cells
          //  - returns true if all are legal coordinates & all match currPlayer
      
          return cells.every(
            ([y, x]) =>
              y >= 0 &&
              y < this.HEIGHT &&
              x >= 0 &&
              x < this.WIDTH &&
              this.board[y][x] === this.currPlayer
          );
        }
      
        for (let y = 0; y < this.HEIGHT; y++) {
          for (let x = 0; x < this.WIDTH; x++) {
            // get "check list" of 4 cells (starting here) for each of the different
            // ways to win
            const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      
            // find winner (only checking each win-possibility as needed)
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
              return true;
            }
          }
        }
    }
}

class Player {
    constructor(color) {
        this.color = color;
    }
}

const startButton = document.getElementById("start");
let p1Color =  document.getElementById("playerOne").value;
let p2Color =  document.getElementById("playerTwo").value;


startButton.addEventListener("click", () => {
    let playerOne = new Player(p1Color);
    let playerTwo = new Player(p2Color);
    new Game(6, 7, playerOne, playerTwo);
});
