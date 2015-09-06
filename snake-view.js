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
    $(".current-score").addClass("active");
    this.board = new SnakeGame.Board(speed);

    this.timer = window.setInterval(function() {
      this.step();
    }.bind(this), speed);

    this.startGameplayAudioLoop();

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
    $(".current-score span").html(this.board.score);
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
    $("#loop").prop('loop', false);
    document.getElementById('loop').pause();
    document.getElementById('loop').currentTime = 0;
    document.getElementById('die').play();

    this.$cells.filter(".snake").addClass("dead").removeClass("snake");
    $(".current-score").removeClass("active");

    var $overlay = this.$el.find(".gameover").addClass("active");
    $overlay.find(".player-score").html(this.board.score);

    var worstHighScore = parseInt($overlay.find(".score").last().html());
    if (this.board.score > worstHighScore) {
      this.enterNewHighScore();
    } else {
      this.displayHighScores();
    }

    window.clearInterval(this.timer);
    this.keyHandler.off();
  };

  View.prototype.displayHighScores = function() {
    this.$el.find(".highscores").addClass("active");
    this.restartHandler = $(document).keydown(this.restart.bind(this));
  };

  View.prototype.enterNewHighScore = function() {
    this.$el.find(".highscore-entry").addClass("active");
    this.highscoreHandler = $(".highscore-entry").on(
      "click", ".highscore-submit", this.updateHighScores.bind(this)
    );
  };

  View.prototype.updateHighScores = function(event) {
    this.highscoreHandler.off();

    var $form = $(event.currentTarget).parent();
    var $highscores = this.$el.find(".highscores");
    var sobriquet = $form.find(".sobriquet").val();

    // Look through the page's list of pre-seeded or updated high-scores.
    $highscores.find("li").each(function (_, scoreEntry) {
      if (parseInt($(scoreEntry).find(".score").html()) < this.board.score) {
        // Update the first one worse than the player's score.
        $(scoreEntry).find(".sobriquet").html(sobriquet);
        $(scoreEntry).find(".score").html(this.board.score);
        $(scoreEntry).addClass("strong");
        return false; // break out of the loop
      }
    }.bind(this));

    // Then display the new scores and remove this form from the DOM.
    this.$el.find(".highscore-entry").removeClass("active");
    this.displayHighScores();
  };

  // ---------------------------------------------------------------------------

  View.prototype.startGameplayAudioLoop = function() {
    $("#loop").prop("loop", true);
    document.getElementById('loop').play();
  };

  // View.prototype.playRandomAudio = function(playlist) {
  //   this.currentAudio = $(_.sample(playlist));
  //   console.log(this.currentAudio.context.currentSrc + " playing!");
  //   this.currentAudio[0].play();
  //
  //   this.currentAudio.on("ended", function() {
  //     console.log(this.currentAudio.context.currentSrc + " over!");
  //     this.currentAudio[0].pause();
  //     this.currentAudio[0].currentTime = 0;
  //     // this.currentAudio.off();
  //   }.bind(this));
  // };

  // ---------------------------------------------------------------------------

  View.prototype.restart = function(event) {
    if (event.keyCode === 32) {
      this.restartHandler.off();
      $(".current-score span").html(0);
      this.wipe(); // just for rendering purposes; start() makes a new Board

      this.$el.find(".highscores li.strong").removeClass("strong");
      this.$el.find(".highscores").removeClass("active");

      this.$el.find(".gameover").removeClass("active");
      this.$el.find(".newgame").addClass("active");
      this.newGameHandler = $(".newgame").on("click", ".difficulty", this.start.bind(this));
    } else { // ignore everything but Space
      return;
    }
  };
})();
