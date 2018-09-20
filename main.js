import Tetris from "./tetris.js";

const startBtn = document.getElementById("start"),
    resetBtn = document.getElementById("reset"),
    divRender = document.getElementById("render"),
    divInfo = document.getElementById("info"),
    divNextShape = document.getElementById("nextShape");

startBtn.addEventListener("click", event => {
    let tetris = new Tetris(10, 15);
    tetris.startTheGame();
    tetris.keyboardEvents();
    document.getElementById("pauseNote").style.display = "block";
    const renderInterval = setInterval(() => {
        render(tetris.board);
        renderInfo(tetris);
        renderNextShape(tetris.shapes[tetris.nextShape][0]);
        if (tetris.end) {
            clearInterval(renderInterval);
        }
    }, 100);
    startBtn.style.display = "none";
    resetBtn.style.display = "block";
    resetBtn.addEventListener("click", event => {
       location.reload();
    });
});

function render(board) {
    let print = `<table>`;
    for (let row in board) {
        print += `<tr id='row_${row}' style='display:${row < 3 ? "none" : "block"}'>`;
        for (let column in board[row]) {
            let color = "white";
            if (board[row][column] === 1) color = "black";
            print += `<td id='${row}_${column}' class='${color}'>`;
        }
        print += `</tr>`;
    }
    print += `</table>`;
    divRender.innerHTML = print;
}

function renderInfo(info) {
    divInfo.innerHTML = `<br>Points: ${info.points} ........ Level: ${info.level} ........ Time: ${info.time} sec. <br>`;
}

function renderNextShape(shape) {
    const arr = shape.split(""),
        [black, white] = ["#", " "];
    let index = 0;
    let print = "Next Shape:<br><table class='nShape'>";
    for (let i = 0; i < 4; i++) {
        print+="<tr>";
        for (let j = 0; j < 4; j++) {
            const className = arr[index] === "1" ? "black" : "white";
            print += "<td class="+ className +"> </td>";
            index++;
        }
        print += "<tr>"
    }
    print+="</table>";
    divNextShape.innerHTML = print;
}