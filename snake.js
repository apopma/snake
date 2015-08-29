(function () {
  if (typeof SnakeGame === "undefined") {
    SnakeGame = window.SnakeGame = {};
  }

  SnakeGame.BOARD = {
    WIDTH: 25,
    HEIGHT: 25
  };

  SnakeGame.SYMBOLS = {
    BLANK: ".",
    SNAKE: "s",
    APPLE: "a"
  };

  var Pos = SnakeGame.Pos = function(x, y) {
    this.x = x;
    this.y = y;
  };

  var Snake = SnakeGame.Snake = function (board) {
    this.board = board;
    this.symbol = SnakeGame.SYMBOLS.SNAKE;
    this.dir = "N";
    var center = new Pos(
                      Math.floor(SnakeGame.BOARD.WIDTH/2),
                      Math.floor(SnakeGame.BOARD.HEIGHT/2)
                    );
    this.segments = [center];
    this.length = this.segments.length - 1;
    this.growing = 0;
    this.turning = null;
    this.head = function() { return this.segments[this.segments.length - 1]; };
  };

  var Board = SnakeGame.Board = function (speed) {
    this.symbol = SnakeGame.SYMBOLS.BLANK;
    this.WIDTH = SnakeGame.BOARD.WIDTH;
    this.HEIGHT = SnakeGame.BOARD.HEIGHT;
    this.snake = new Snake(this);
    this.apple = new Apple(this);

    switch(speed) {
      case 500:
        this.pointsPerApple = 10;
        break;
      case 250:
        this.pointsPerApple = 20;
        break;
      case 93:
        this.pointsPerApple = 30;
        break;
      default:
        this.pointsPerApple = 10;
        break;
    }

    this.score = 0;
  };

  var Apple = SnakeGame.Apple = function (board) {
    this.symbol = SnakeGame.SYMBOLS.APPLE;
    this.board = board;
    this.place();
  };

  SnakeGame.DIRS = {
    "N": new Pos(-1, 0),
    "E": new Pos(0, 1),
    "W": new Pos(0, -1),
    "S": new Pos(1, 0)
  };

  // ---------------------------------------------------------------------------

    Pos.prototype.plus = function (pos2) {
      var newX = this.x + pos2.x;
      var newY = this.y + pos2.y;
      return new Pos(newX, newY);
    };

    Pos.prototype.eql = function (pos2) {
      return ((this.x === pos2.x) && (this.y === pos2.y));
    };

    Pos.prototype.isOppositeOf = function (pos2) {
      return ((this.x === (-1 * pos2.x)) && (this.y === (-1 * pos2.y)));
    };

  // ---------------------------------------------------------------------------

  Snake.prototype.move = function() {
    var newHead = this.head().plus(SnakeGame.DIRS[this.dir]);
    if (this.moveOffBoard(newHead) || this.moveIntoSelf(newHead)) { return false; }

    this.segments.push(newHead);
    this.turning = false;
    if (this.growing > 0)         { this.growing--; }
    if (this.isApplePos(newHead)) { this.eat(); }
    if (!this.growing)            { this.segments.shift(); }
    return true;
  };

  Snake.prototype.turn = function(newDir) {
    var isUTurn = SnakeGame.DIRS[newDir].isOppositeOf(SnakeGame.DIRS[this.dir]);
    if (this.turning || isUTurn) {
      // don't allow turns into yourself or turning in-between moves
      return;
    } else {
      this.turning = true;
      this.dir = newDir;
    }
  };

  Snake.prototype.eat = function() {
    this.growing += 3;
    this.board.score += this.board.pointsPerApple;
    this.board.apple.place();
  };

  Snake.prototype.isApplePos = function (head) {
    return this.board.apple.pos.eql(head);
  };

  Snake.prototype.moveOffBoard = function(head) {
    // True if any of the head's coords are <0, >HEIGHT, or >WIDTH.
    var coords = [head.x, head.y];
    return _.some(coords, function(coord) {
      return (coord < 0 ||
      coord >= SnakeGame.BOARD.WIDTH ||
      coord >= SnakeGame.BOARD.HEIGHT);
    });
  };

  Snake.prototype.moveIntoSelf = function(head) {
    // True if the head's coords match any of the segments.
    return _.some(this.segments, function(segment) {
      return head.eql(segment);
    }.bind(this));
  };

  Snake.prototype.at = function (pos) {
    return _.some(this.segments, function(segment) {
      return pos.eql(segment);
    });
  };

  // ---------------------------------------------------------------------------

  Board.makeGrid = function () {
    var grid = [];
    for (var i = 0; i < SnakeGame.BOARD.HEIGHT; i++) {
      grid.push([]);
      for (var j = 0; j < SnakeGame.BOARD.WIDTH; j++) {
        grid[i].push(SnakeGame.SYMBOLS.BLANK);
      }
    }

    return grid;
  };

  Board.prototype.render = function () {
    var boardString = "";
    var grid = Board.makeGrid();

    _.each(this.snake.segments, function(segment) {
      grid[segment.x][segment.y] = this.snake.symbol;
    }.bind(this));

    grid[this.apple.pos.x][this.apple.pos.y] = this.apple.symbol;

    grid.map(function (row) {
      return row.join("");
    }).join("\n");
  };

  // ---------------------------------------------------------------------------

  Apple.prototype.place = function() {
    var x = Math.floor(Math.random() * this.board.WIDTH);
    var y = Math.floor(Math.random() * this.board.HEIGHT);

    var pos = new Pos(x, y);
    while (this.board.snake.at(pos)) {
      x = Math.floor(Math.random() * this.board.WIDTH);
      y = Math.floor(Math.random() * this.board.HEIGHT);
      pos = new Pos(x, y);
    }

    this.pos = pos;
  };

})();
