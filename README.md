# [Snake!](http://apopma.github.io/snake)
A little JS game which is just writhing with potential. Uses jQuery to render its graphics and handle view logic, and a few Underscore methods to make the core game code cleaner.

## How to Play
Move about with the arrow keys, and eat apples for points. A higher difficulty will give you more points per apple. How high a score can you get before you hit something? Strive to beat the top scorers!

## Implementation Details
- [`snake.js`](http://github.com/apopma/snake/blob/master/snake.js) holds all the core game logic.
- [`snake-view.js`](http://github.com/apopma/snake/blob/master/snake-view.js) holds the view logic and the jQuery responsible for updating highscores and handling browser events.

### `snake-view` details
- [`colorCells`](https://github.com/apopma/snake/blob/master/snake-view.js#L54) colors the board's cells by adding and removing classes: `snake` is green, `apple` is red; no class is white. Uses Underscore `each` to iterate through the given coordinates (either a list of snake segments, or a single apple position) and jQuery `eq` to find the cell corresponding to the coordinate's x/y position.
- [`gameover`](https://github.com/apopma/snake/blob/master/snake-view.js#L90) swaps the `snake` class on all snake segments for a `dead` class which renders a darker green, then disables gameplay key-handlers and renders an end-of-game overlay. If the player scored higher than the worst high score, a form pops up to enter a name for the high-score list.
- [`updateHighScores`](https://github.com/apopma/snake/blob/master/snake-view.js#L119) looks through each `<li>` in the page's list of high scores, and updates its HTML with the player's entered name and score. It also bolds the player's name by adding a `strong` class which is cleared out on the next render of this list.
