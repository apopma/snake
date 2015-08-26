(function () {
  if (typeof SnakeGame === "undefined") {
    SnakeGame = window.SnakeGame = {};
  }

  var View = SnakeGame.View = function() {
    this.$el = $.find("#snakegame");
    this.board = new SnakeGame.Board();
  };
})();
