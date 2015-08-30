(function () {
  if (typeof SnakeGame === "undefined") {
    SnakeGame = window.SnakeGame = {};
  }

  var View = SnakeGame.View = function() {
    this.KEY_CODES = SnakeGame.KEY_CODES;

    this.$el = $($.find("#snakegame"));
    this.$gameboard = this.$el.find("#board");
    this.makeHtml();

    this.newGameHandler = $(".newgame").on("click", ".difficulty", this.start.bind(this));
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

    this.newGameHandler.off();
    this.keyHandler = $(window).on("keydown", this.handleKeypress.bind(this));
  };

  // ---------------------------------------------------------------------------

  View.prototype.step = function() {
    var validMove = this.board.snake.move();
    validMove ? this.draw() : this.gameover();
  };

  View.prototype.draw = function() {
    this.colorCells(this.board.snake.segments, "snake");
    this.colorCells([this.board.apple.pos], "apple");
  };

  View.prototype.wipe = function() {
    this.$cells.removeClass("dead").removeClass("apple");
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
      event.preventDefault();
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
    var $overlay = this.$el.find(".gameover").addClass("active");
    $overlay.find(".player-score").html(this.board.score);

    var worstHighScore = parseInt($overlay.find(".score").last().html());
    if (this.board.score > worstHighScore) { this.enterNewHighScore(); }

    window.clearInterval(this.timer);
    this.keyHandler.off();
    this.restartHandler = $(document).keydown(this.restart.bind(this));
  };

  View.prototype.enterNewHighScore = function() {
    this.$el.find(".highscore-entry").addClass("active");
    this.highscoreHandler = $(".highscore-entry").on(
      "click", ".highscore-submit", this.updateHighscores.bind(this)
    );
  };

  View.prototype.updateHighscores = function(event) {
    event.preventDefault();

    var highscores = this.$el.find(".score").map(function (_, score) {
      return parseInt($(score).html());
    }.bind(this));

    var $form = $(event.currentTarget).parent();
    var sobriquet = $form.find(".sobriquet").val();
    debugger;
  };

  View.prototype.restart = function(event) {
    if (event.keyCode !== 32) { return; } // ignore everything but Space
    this.restartHandler.off();

    this.wipe(); // just for rendering purposes; start() makes a new Board

    this.$el.find(".gameover").removeClass("active");
    this.$el.find(".newgame").addClass("active");
    this.newGameHandler = $(".newgame").on("click", ".difficulty", this.start.bind(this));
  };
})();
