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

    $(window).on("keydown", this.handleKeypress.bind(this));
  };

  // ---------------------------------------------------------------------------

  View.prototype.step = function() {
    this.board.snake.move();
    this.draw();
  };

  View.prototype.draw = function() {
    this.$el.html(this.board.render());
  };

  View.prototype.handleKeypress = function (event) {
    var keyCode = event.which;
    // N: 38, W: 39, S: 40, E: 37
    // P: 80, Space: 32, Enter: 13

    switch(keyCode) {
      case 37:
        this.board.snake.turn("W");
        break;
      case 38:
        this.board.snake.turn("N");
        break;
      case 39:
        this.board.snake.turn("E");
        break;
      case 40:
        this.board.snake.turn("S");
        break;
      case 80:
        debugger;
        break;
      default:
        console.log(keyCode);
    }
  };
})();
