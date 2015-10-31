# battleship_js
an implementation of battleship in HTML/CSS/JS

# Test Mode

* game screens
	* start
	* privacy/feedback
	* active turn  
* game states
	* start
	* prepare player 1 turn
	* player 1 active turn
	* feedback/prepare player 2 turn
	* player 2 active turn
	* feedback/prepare player 1 turn
	* feedback/gameover
- grid: 2 x 2
- single ship: 2 squares long
- hard-coded ship placement
- token accessibility, ARIA roles for document structure
- token responsive, 1 @media rule
- basic white/teal color scheme and text elements

# MVP
- simple app structure:
 	* index.html
 	* style.css (plus normalize.css)
 	* script.js (plus jQuery)
- grid: 10 x 10
- ships: 5, lengths: [2, 3, 3, 4, 5]
- random ship placement

# Wish list

- more thorough accessibility/keyboard support
- more responsive, integrate bootstrap?
- visual design improvement pass
- implement as non-violent alternative game
  * guessing where the other person has connected stars to make constellations
  * make ships into words, add 'wheel of fortune' word guessing component as alternate way to claim/sink full ship/word
  * nefarious hacking version, guess the other person's android swipe/password combinations