(function () {
  if (typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  }

  var Snake = SnakeGame.Snake = function () {
    this.dir = "N";
    this.segments = [[12, 12]];
  };

  var Snake.DIRS = {
    "N": [0, -1],
    "E": [1, 0],
    "W": [0, 1],
    "S": [-1, 0]
  };

  Snake.prototype.move = function(dir) {
    var lastHeadX = this.segments[this.segments.length[0]];
    var lastHeadY = this.segments[this.segments.length[1]];

    var newHeadX = lastHeadX + Snake.DIRS[dir][0]
    var newHeadY = lastHeadY + Snake.DIRS[dir][1]
    var newHead = [lastHeadX, lastHeadY];

    this.segments.unshift(newHead);
    this.segments.pop();
  };

  Snake.prototype.turn = function(newDir) {
    this.dir = newDir;
  }

  var Board = SnakeGame.Board = function () {
    this.grid = Board.makeGrid();
    this.snake = new Snake();
  };

  Board.makeGrid = function () {
    var grid = [];

    for (var i = 0; i < 25; i++) {
      grid.push([]);
      for (var j = 0; j < 25; j++) {
        grid[i].push(".");
      }
    }

    return grid;
  };

  Board.prototype.render = function () {
    var boardString = "";

    for (var row = 0; row < this.grid[0].length; row++) {
      for (var col = 0; col < row.length; col++) {
        var boardPos = [row, col];
        for (var seg = 0; seg < this.snake.segments.length; seg++) {
          if (this.hasSegmentAt(boardPos, this.snake.segments[seg])) {
            boardString += "s";
          } else {
            boardString += ".";
          }
        }
      }

      boardString += "\n";
    }

    return boardString;
  };

  Board.prototype.hasSegmentAt = function (boardPos, snakePos) {
    if (boardPos[0] === snakePos[0] && boardPos[1] === snakePos[1]) {
      return true;
    } else {
      return false;
    }
  };
})();
