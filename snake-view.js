(function () {
  if (typeof SnakeGame === "undefined") {
    SnakeGame = window.SnakeGame = {};
  }

  var View = SnakeGame.View = function() {
    this.KEY_CODES = SnakeGame.KEY_CODES;

    this.$el = $($.find("#snakegame"));
    this.board = new SnakeGame.Board();
    this.makeHtml();

    window.setInterval(function() {
      this.step();
    }.bind(this), 500);

    $(window).on("keydown", this.handleKeypress.bind(this));
  };

  SnakeGame.KEY_CODES = {
    38: "N",
    37: "W",
    39: "E",
    40: "S"
  };

  // ---------------------------------------------------------------------------

  View.prototype.step = function() {
    this.board.snake.move();
    this.draw();
  };

  View.prototype.draw = function() {
    // this.$el.html(this.board.render());
  };

  View.prototype.handleKeypress = function (event) {
    if (this.KEY_CODES[event.keyCode]) {
      this.board.snake.turn(this.KEY_CODES[event.keyCode]);
    } else {
      // nothing whatever!
    }
  };

  View.prototype.makeHtml = function() {
    var html = "";

    for (var i = 0; i < this.board.HEIGHT; i++) {
      html += "<div class='row'>";
      for (var j = 0; j < this.board.WIDTH; j++) {
        html += "<div class='cell'></div>";
      }
      html += "</div>";
    }

    this.$el.html(html);
    this.$cells = this.$el.find(".cell");
  };
})();
