class Tetris {
    constructor(boardWidth, boardHeight) {
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
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
        this.speedIncrement = 100;
    }

    startTheGame(){
        this.addToTable();
        let interval = setInterval(() => {
            this.addToTable();
            if (this.isPossileToGoDown()) {
                this.moveDown();
                this.removeShape();
            } else {
                this.board = JSON.parse(JSON.stringify(this.board));
                this.findFullLines();
                this.currentShape = this.nextShape;
                this.nextShape = this.randomShape();
                this.position = 0;
                this.shapeSpaceOnTable = JSON.parse(JSON.stringify(this.startSpaceOnTable));
            }
            this.addToTable();
        }, this.speed)
    }

    keyboardEvents(){
        document.addEventListener("keydown", event => {
            if (event.key === "ArrowUp") {
                if (this.isPossibleToRotate()) this.rotate();
            } else if (event.key === "ArrowLeft"){
                if(this.isPossibleToMoveAside("left")) this.move("left");
            } else if (event.key === "ArrowRight"){
                if(this.isPossibleToMoveAside("right")) this.move("right");
            } else if (event.key === "ArrowDown"){
                if (this.isPossileToGoDown()) this.moveDown();
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
            if (parseInt(this.shapes[this.currentShape][this.position][i]) === 1){
                this.currentPlace.push(placeOnTable[i]);
                this.board[placeOnTable[i][0]][placeOnTable[i][1]] = parseInt(this.shapes[this.currentShape][this.position][i]);
            }
        }
    }

    removeShape(){
        for (let i = 0; i < this.currentPlace.length; i++) {
            this.board[this.currentPlace[i][0]][this.currentPlace[i][1]] = 0;
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

    isPossibleToRotate(){
        let position = this.position === 3 ? 0 : this.position + 1;
        let placeOnTable = JSON.parse(JSON.stringify(this.shapeSpaceOnTable));
        for (let i = 0; i < this.shapes[this.currentShape][position].length; i++) {
            if (parseInt(this.shapes[this.currentShape][position][i]) === 1){
                if(placeOnTable[i][0]>=this.boardHeight || placeOnTable[i][1] < 0 || placeOnTable[i][1]>=this.boardWidth) return false;
            }
        }
        return true;
    }

    move(leftOrRight){
        this.removeShape();
        let increment = 1;
        if (leftOrRight === "left") increment = -1;
        for (let i = 0; i< this.shapeSpaceOnTable.length; i++) {
            this.shapeSpaceOnTable[i][1] += increment;
        }
    }

    moveDown(){
        this.removeShape();
        for (let i = 0; i< this.shapeSpaceOnTable.length; i++) {
            this.shapeSpaceOnTable[i][0] += 1;
        }
    }

    isPossileToGoDown(){
        let nextPosition = [],
            lastDotInNextPosition;
        for (let i = 0; i< this.currentPlace.length; i++) {
            nextPosition.push(this.currentPlace[i][0]+1);
            lastDotInNextPosition = [this.currentPlace[i][0]+1, this.currentPlace[i][1]];
        }
        if (this.board[lastDotInNextPosition[0]] !== undefined) return this.board[lastDotInNextPosition[0]][lastDotInNextPosition[1]]!==1;
        return nextPosition.toString().indexOf(this.boardHeight) === -1;
    }

    isPossibleToMoveAside(leftOrRight){
        const increment = leftOrRight === "left" ? -1 : 1;
        for (let i = 0; i< this.currentPlace.length; i++) {
            const nextPlace = this.currentPlace[i][1]+increment;
            if (nextPlace < 0 || nextPlace >= this.boardWidth) return false;
        }
        return true;
    }

    findFullLines(){
        console.log("start finding full lines");
        for (let row = this.boardHeight-1; row >= 0; row--){
            let counter = 0;
            for (let field in this.board[row]){
                if (this.board[row][field] === 1) counter++;
            }
            if (counter === this.boardWidth){
                this.addToTable();
                this.removeFullLine(row);
                this.board.unshift([0,0,0,0,0,0,0,0,0,0]);
                this.findFullLines();
            }
        }
    }

    removeFullLine(row){
        this.board.splice(row,1);
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