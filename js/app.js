// DOM interface
const turnDisplay = document.querySelector('h2');
const squares = document.querySelectorAll('td');

const game = {
    // state
    lookup: {
        '1': 'images/apple.png',
        '-1': 'images/windows.png',
        'null': '',
        '0': 'images/linux.png'
    },
    playerNames: ['player1', 'player2'],
    board: [],
    turn: 1,
    winner: '',
    // methods
    init(){
        this.board = [];
        for(let i = 0; i < 9; i++) this.board.push('null');
        this.winner = 'null'
        this.turn = 1;
    },
    calculateWinner() {
        const winCombos = [
            [0 ,1 ,2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        //  map actual board array value to win condition combinations
        winCombos.forEach(combo => combo.map( (square, index) => combo[index] = this.board[square]));

        // reduce the newly mapped array to sums
        winCombos.forEach( (combo, index) => winCombos[index]  = combo.reduce((acc, value) => acc += value, 0));

        for(let combo of winCombos) {
            if(combo === 3) {
                this.winner = this.playerNames[0];
            } else if(combo === -3){
                this.winner = this.playerNames[1];
            } else if(this.board.every(square => square !== 'null')){
                if(this.winner === 'null'){
                    this.winner = 'tie';
                }
            }

            if(Math.abs(combo) === 3) {
                // fill unplayed squares with Linux penguins
                this.board.forEach( (square, index) => {
                    if(square === 'null') {
                        this.board[index] = '0'
                    }
                });
            }
        }
    },
    render(){
        this.calculateWinner();
        squares.forEach( (square, index) => {
            let player = this.board[index];
            let fill = this.lookup[player];
            square.innerHTML = `<img src="${fill}"/>`;
        })
        if(this.winner !== 'null'){
            turnDisplay.textContent = `Winner: ${this.winner}!`;
        } else {
            if(this.turn === 1){
                turnDisplay.textContent = "player 1's turn!"
            } else {
                turnDisplay.textContent = "player 2's turn!"
            }
        }
    }
};


// click handler
document.querySelector('table').addEventListener('click', e => {
    if (e.target != e.currentTarget) {
        // console.log(e.target);
        // figure out the index for the clicked target
        let index = parseInt(e.target.id.replace('sq-', ''));

        if(game.board[index] === 'null') {
            // update the board using turn value
            game.board[index] = game.turn;
            // change turn
            game.turn *= -1;
            game.render();
        }
        // console.log(e.target, game.board[index]);
    }

});

// button logic
document.querySelector('button').addEventListener('click', function(){
    game.init();
    game.render();
})

// do it...
game.init();
game.render();
