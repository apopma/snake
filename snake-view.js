(function () {
  if (typeof SnakeGame === "undefined") {
    SnakeGame = window.SnakeGame = {};
  }

  var View = SnakeGame.View = function() {
    this.KEY_CODES = SnakeGame.KEY_CODES;

    this.$el = $($.find("#snakegame"));
    this.$gameboard = this.$el.find("#board");
    this.makeHtml();

    $(".newgame").on("click", ".difficulty", this.start.bind(this));
  };

  SnakeGame.KEY_CODES = {
    38: "N",
    37: "W",
    39: "E",
    40: "S",
  };

  View.prototype.start = function (event) {
    var speed = $(event.target).data("speed");
    this.$el.find(".newgame").removeClass("active");
    this.board = new SnakeGame.Board(speed);

    this.timer = window.setInterval(function() {
      this.step();
    }.bind(this), speed);

    $(".newgame").off();
    $(window).on("keydown", this.handleKeypress.bind(this));
  };

  // ---------------------------------------------------------------------------

  View.prototype.step = function() {
    var validMove = this.board.snake.move();
    validMove ? this.draw() : this.gameover();
  };

  View.prototype.draw = function() {
    // this.$el.html(this.board.render());

    this.colorCells(this.board.snake.segments, "snake");
    this.colorCells([this.board.apple.pos], "apple")
  };

  View.prototype.colorCells = function(coords, className) {
    this.$cells.filter("." + className).removeClass(className);

    _.each(coords, function(coord) {
      // Find the (flattened) index of this cell, then color it.
      var ord = (coord.x * this.board.HEIGHT) + coord.y;
      this.$cells.eq(ord).addClass(className);
    }.bind(this));
  };

  View.prototype.handleKeypress = function (event) {
    if (event.keyCode === 80) { debugger; }  // P

    if (this.KEY_CODES[event.keyCode]) {
      this.board.snake.turn(this.KEY_CODES[event.keyCode]);
    } else {
      // nothing whatever!
    }
  };

  View.prototype.makeHtml = function() {
    var html = "";

    for (var i = 0; i < SnakeGame.BOARD.HEIGHT; i++) {
      html += "<div class='row'>";
      for (var j = 0; j < SnakeGame.BOARD.WIDTH; j++) {
        html += "<div class='cell'></div>";
      }
      html += "</div>";
    }

    this.$gameboard.html(html);
    this.$cells = this.$gameboard.find(".cell");
  };

  View.prototype.gameover = function() {
    this.$cells.filter(".snake").addClass("dead").removeClass("snake");
    alert("Game over! Your score was " + this.board.score + ".");
    window.clearInterval(this.timer);
    $(window).off();
  };
})();
