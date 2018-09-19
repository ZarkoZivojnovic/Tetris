import Tetris from "./tetris.js";

let tetris = new Tetris(10,15);
tetris.startTheGame();
tetris.keyboardEvents();
setInterval(() => {
    render(tetris.board);
},100);


function render(board) {
    let print = `<table>`;
    for (let row in board){
        print+= `<tr id='row_${row}'>`;
        for (let column in board[row]){
            let color = "white";
            if (board[row][column] === 1) color = "black";
            print+= `<td id='${row}_${column}' class='${color}'>`;
        }
        print+=`</tr>`;
    }
    print+=`</table>`;
    document.getElementById("render").innerHTML = print;
}

