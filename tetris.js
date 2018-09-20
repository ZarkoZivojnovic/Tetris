class Tetris {
    constructor(boardWidth, boardHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight+3;
        this.board = this.createEmptyBoard();
        this.shapes = {
            i: ["0000111100000000", "0100010001000100", "0000111100000000", "0100010001000100"],
            l: ["0000000011101000", "0000110001000100", "0000001011100000", "0000010001000110"],
            j: ["0000000011100010", "0000010001001100", "0000100011100000", "0000011001000100"],
            o: ["0000000001100110", "0000000001100110", "0000000001100110", "0000000001100110"],
            s: ["0000010001100010", "0000000001101100", "0000010001100010", "0000000001101100"],
            t: ["0000010011001000", "0000000011000110", "0000010011001000", "0000000011000110"],
            z: ["0000000011100100", "0000010011000100", "0000010011100000", "0000010001100100"]
        };
        this.level = 1;
        this.points = 0;
        this.position = 0;
        this.currentShape = this.randomShape();
        this.currentPlace = [];
        this.nextShape = this.randomShape();
        this.startSpaceOnTable = [
            [0, 3], [0, 4], [0, 5], [0, 6],
            [1, 3], [1, 4], [1, 5], [1, 6],
            [2, 3], [2, 4], [2, 5], [2, 6],
            [3, 3], [3, 4], [3, 5], [3, 6]
        ];
        this.shapeSpaceOnTable = [];
        this.speed = 1500;
        this.speedIncrement = 200;
        this.time = 0;
        this.pause = false;
        this.end = false;
    }

    startTheGame() {
        this.startTime();
        this.addToTable();
        let speed = this.speed;
        let interval = setInterval(() => {
            if (!this.pause && !this.end){
                if (this.isPossileToGoDown()) {
                    this.moveDown();
                    this.removeShape();
                } else {
                    this.findAndRemoveFullLines();
                    this.currentShape = this.nextShape;
                    this.nextShape = this.randomShape();
                    this.position = 0;
                    this.shapeSpaceOnTable = JSON.parse(JSON.stringify(this.startSpaceOnTable));
                    if (this.isTheEnd()) {
                        this.addToTable();
                        this.gameOver();
                        clearInterval(interval);
                    }
                }
                this.addToTable();
                if (speed !== this.speed) {
                    clearInterval(interval);
                    this.startTheGame();
                }
            } else if (this.end) {
                clearInterval(interval);
                this.resetGame();
            }
        }, speed)
    }

    resetGame(){
        this.board = this.createEmptyBoard();
        this.level = 1;
        this.points = 0;
        this.position = 0;
        this.currentShape = this.randomShape();
        this.currentPlace = [];
        this.nextShape = this.randomShape();
        this.shapeSpaceOnTable = [];
        this.speed = 1500;
        this.time = 0;
    }

    startTime() {
        const timeInterval = setInterval(() => {
            if (!this.pause) this.time++;
            if (this.end) clearInterval(timeInterval);
        }, 1e3)
    }

    gameOver() {
        alert("GAME OVER! \n You won " + this.points + " points!")
    }

    isTheEnd() {
        for (let i = 0; i < this.startSpaceOnTable.length; i++) {
            for (let j = 0; j < this.startSpaceOnTable[i].length; j++) {
                if (this.board[this.startSpaceOnTable[i][0]][this.startSpaceOnTable[i][1]] === 1) return true;
            }
        }
    }

    keyboardEvents() {
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowUp") {
                if (this.isPossibleToRotate() && !this.pause) this.rotate();
            } else if (event.key === "ArrowLeft") {
                if (this.isPossibleToMoveAside("left") && !this.pause) this.move("left");
            } else if (event.key === "ArrowRight") {
                if (this.isPossibleToMoveAside("right") && !this.pause) this.move("right");
            } else if (event.key === "ArrowDown") {
                if (this.isPossileToGoDown() && !this.pause) this.moveDown();
            } else if (event.key === "p") {
                this.pause = !this.pause;
            }
            this.removeShape();
            this.addToTable();
        })
    }

    addToTable() {
        if (this.shapeSpaceOnTable.length === 0) this.shapeSpaceOnTable = JSON.parse(JSON.stringify(this.startSpaceOnTable));
        this.currentPlace = [];
        let placeOnTable = JSON.parse(JSON.stringify(this.shapeSpaceOnTable));
        for (let i = 0; i < this.shapes[this.currentShape][this.position].length; i++) {
            if (parseInt(this.shapes[this.currentShape][this.position][i]) === 1) {
                this.currentPlace.push(placeOnTable[i]);
                this.board[placeOnTable[i][0]][placeOnTable[i][1]] = parseInt(this.shapes[this.currentShape][this.position][i]);
            }
        }
    }

    removeShape() {
        for (let i = 0; i < this.currentPlace.length; i++) {
            this.board[this.currentPlace[i][0]][this.currentPlace[i][1]] = 0;
        }
    }

    returnTheShape() {
        for (let i = 0; i < this.currentPlace.length; i++) {
            this.board[this.currentPlace[i][0]][this.currentPlace[i][1]] = 1;
        }
    }

    rotate() {
        this.removeShape();
        if (this.position === 3) {
            this.position = 0;
        } else {
            this.position++;
        }
        this.addToTable()
    }

    isPossibleToRotate() {
        const position = this.position === 3 ? 0 : this.position + 1,
            placeOnTable = JSON.parse(JSON.stringify(this.shapeSpaceOnTable));
        this.removeShape();
        for (let i = 0; i < this.shapes[this.currentShape][position].length; i++) {
            if (parseInt(this.shapes[this.currentShape][position][i]) === 1) {
                if (this.rotationNotPossible(placeOnTable[i])) return false;
            }
        }
        return true;
    }

    rotationNotPossible(position){
        return position[0] >= this.boardHeight || position[1] < 0 || position[1] >= this.boardWidth || this.board[position[0]][position[1]] === 1;
    }

    move(leftOrRight) {
        this.removeShape();
        let increment = 1;
        if (leftOrRight === "left") increment = -1;
        for (let i = 0; i < this.shapeSpaceOnTable.length; i++) {
            this.shapeSpaceOnTable[i][1] += increment;
        }
    }

    moveDown() {
        this.removeShape();
        for (let i = 0; i < this.shapeSpaceOnTable.length; i++) {
            this.shapeSpaceOnTable[i][0] += 1;
        }
    }

    isPossileToGoDown() {
        let nextPosition = [],
            lastDotInNextPosition;
        for (let i = 0; i < this.currentPlace.length; i++) {
            nextPosition.push([[this.currentPlace[i][0] + 1], [this.currentPlace[i][1]]]);
            lastDotInNextPosition = [this.currentPlace[i][0] + 1, this.currentPlace[i][1]];
        }
        this.removeShape();
        for (let position in nextPosition) {
            if (this.board[nextPosition[position][0]] !== undefined && this.board[nextPosition[position][0]][nextPosition[position][1]] === 1) {
                this.returnTheShape();
                return false;
            }
        }
        this.returnTheShape();
        if (this.board[lastDotInNextPosition[0]] !== undefined) return this.board[lastDotInNextPosition[0]][lastDotInNextPosition[1]] !== 1;
        return nextPosition.toString().indexOf(this.boardHeight) === -1;
    }

    isPossibleToMoveAside(leftOrRight) {
        const increment = leftOrRight === "left" ? -1 : 1;
        for (let i = 0; i < this.currentPlace.length; i++) {
            const nextPlace = this.currentPlace[i][1] + increment;
            if (nextPlace < 0 || nextPlace >= this.boardWidth) return false;
            this.removeShape();
            if (this.board[this.currentPlace[i][0]][this.currentPlace[i][1] + increment] === 1) {
                this.returnTheShape();
                return false;
            }
            this.returnTheShape();
        }
        return true;
    }

    findAndRemoveFullLines() {
        let rowToAdd = 0;
        for (let row = this.boardHeight - 1; row >= 0; row--) {
            let counter = 0;
            for (let field in this.board[row]) {
                if (this.board[row][field] === 1) counter++;
            }
            if (counter === this.boardWidth) {
                this.board[row] = undefined;
                rowToAdd++;
            }
        }
        for (let index = 0; index < rowToAdd; index++) {
            this.board.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        this.board = this.board.filter(elem => elem !== undefined);
        if (rowToAdd > 0) this.addPoints(rowToAdd);
    }

    addPoints(lines) {
        this.points += lines * 2;
        if (this.points % 10 === 0 && this.points > 0) {
            this.level++;
            if (this.speed >= 500) this.speed -= this.speedIncrement;
        }
    }

    randomShape() {
        const shapes = Object.keys(this.shapes);
        return shapes[this.randomNumber(0, shapes.length - 1)];
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    createEmptyBoard() {
        let arr = [];
        for (let i = 0; i < this.boardHeight; i++) {
            arr[i] = [];
            for (let j = 0; j < this.boardWidth; j++) {
                arr[i].push(0);
            }
        }
        return arr;
    }
}

export default Tetris;