(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
    SnakeGame = {};
  }

  SnakeGame.DIRS = {
    "N": [-1, 0],
    "E": [0, 1],
    "W": [0, -1],
    "S": [1, 0]
  };

  SnakeGame.BOARD = {
    WIDTH: 25,
    HEIGHT: 25
  };

  var Snake = SnakeGame.Snake = function () {
    this.dir = "N";
    this.segments = [[24, 0], [23, 0], [22, 0]];
    this.length = this.segments.length - 1;
  };

  var Board = SnakeGame.Board = function () {
    this.WIDTH = SnakeGame.BOARD.WIDTH;
    this.HEIGHT = SnakeGame.BOARD.HEIGHT;
    this.grid = Board.makeGrid();
    this.snake = new Snake();
  };

  // ---------------------------------------------------------------------------

  Snake.prototype.move = function() {
    console.log(this.dir);
    var lastSegment = this.segments.length - 1;

    var lastHeadX = this.segments[lastSegment][0];
    var lastHeadY = this.segments[lastSegment][1];

    var newHeadX = lastHeadX + SnakeGame.DIRS[this.dir][0];
    var newHeadY = lastHeadY + SnakeGame.DIRS[this.dir][1];
    var newHead = [newHeadX, newHeadY];

    this.segments.push(newHead);
    this.segments.shift();
  };

  Snake.prototype.turn = function(newDir) {
    this.dir = newDir;
  };

  Snake.prototype.display = function() {
    console.log(this.segments.join(" | "));
  };

  // ---------------------------------------------------------------------------

  Board.makeGrid = function () {
    var grid = [];
    for (var i = 0; i < SnakeGame.BOARD.HEIGHT; i++) {
      grid.push([]);
      for (var j = 0; j < SnakeGame.BOARD.WIDTH; j++) {
        grid[i].push(".");
      }
    }

    return grid;
  };

  Board.prototype.render = function () {
    var boardString = "";
    var foundSegmentAtPos;

    for (var row = 0; row < this.HEIGHT; row++) {
      for (var col = 0; col < this.WIDTH; col++) {
        var boardPos = [row, col];

        for (var seg = 0; seg <= this.snake.length; seg++) {
          var snakePos = this.snake.segments[seg];
          foundSegmentAtPos = this.hasSegmentAt(boardPos, snakePos);
          if (foundSegmentAtPos) { break; }
        }

        boardString += foundSegmentAtPos ? "s" : ".";
        foundSegmentAtPos = null;
      }

      boardString += "\n";
    }

    return "\n" + boardString + "\n";
  };

  Board.prototype.hasSegmentAt = function (boardPos, snakePos) {
    if (boardPos[0] === snakePos[0] && boardPos[1] === snakePos[1]) {
      return true;
    } else {
      return false;
    }
  };
})();
