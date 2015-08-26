(function () {
  if (typeof SnakeGame === "undefined") {
    SnakeGame = window.SnakeGame = {};
  }

  var View = SnakeGame.View = function() {
    this.$el = $($.find("#snakegame"));
    this.board = new SnakeGame.Board();

    window.setInterval(function() {
      this.step();
    }.bind(this), 500);
  };

  // ---------------------------------------------------------------------------

  View.prototype.step = function() {
    this.board.snake.move();
    this.draw();
  };

  View.prototype.draw = function() {
    this.$el.html(this.board.render());
  };
})();
