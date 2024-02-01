// Licensed under the MIT license

// Copyright (c) 2024 JOHN RÉ PORAS [https://www.facebook.com/IamJohnPoras.org]

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

let startTime;
let timerInterval;
const timerElement = document.getElementById('timer');

function initializeTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  setTimeout(endGameDueToTimer, 40000);
}

function endGameDueToTimer() {
  clearInterval(timerInterval);
  pauseBackgroundMusic();
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Game Over',
    text: 'Time is up! Try again.',
    type: 'error',
    confirmButtonColor: '#9BCB3C',
    confirmButtonText: 'Play again!'
  }).then(function (isConfirm) {
    if (isConfirm) {
      pauseBackgroundMusic();
      initGame();
      restartBackgroundMusic();
      initializeTimer();
    }
  });
}


function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}


function playBackgroundMusic() {
  var backgroundMusic = document.getElementById('backgroundMusic');
  backgroundMusic.play();
}

function pauseBackgroundMusic() {
  var backgroundMusic = document.getElementById('backgroundMusic');
  backgroundMusic.pause();
}

function restartBackgroundMusic() {
  var backgroundMusic = document.getElementById('backgroundMusic');
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
}


var symbols = ['bicycle', 'bicycle', 'leaf', 'leaf', 'cube', 'cube', 'anchor', 'anchor', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'bomb', 'bomb', 'diamond', 'diamond'],
		opened = [],
		match = 0,
		moves = 0,
		$deck = $('.deck'),
		$scorePanel = $('#score-panel'),
		$moveNum = $scorePanel.find('.moves'),
		$ratingStars = $scorePanel.find('i'),
		$restart = $scorePanel.find('.restart'),
		delay = 800,
		gameCardsQTY = symbols.length / 2,
		rank3stars = gameCardsQTY + 2,
		rank2stars = gameCardsQTY + 6,
		rank1stars = gameCardsQTY + 10;

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
	
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function initGame() {
	var cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  moves = 0;
  $moveNum.html(moves);
  $ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
};

function setRating(moves) {
	var rating = 3;
	if (moves > rank3stars && moves < rank2stars) {
		$ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
		rating = 2;
	} else if (moves > rank2stars && moves < rank1stars) {
		$ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
		rating = 1;
	} else if (moves > rank1stars) {
		$ratingStars.eq(0).removeClass('fa-star').addClass('fa-star-o');
		rating = 0;
	}	
	return { score: rating };
};

function endGame(moves, score) {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Congratulations! You Won!',
    text: 'With ' + moves + ' Moves and ' + score + ' Stars.\nTanginamooo!',
    type: 'success',
    confirmButtonColor: '#9BCB3C',
    confirmButtonText: 'Play again!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      restartBackgroundMusic();
      initGame();
    }
  })
}

$restart.on('click', function() {
  swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "Your progress will be Lost!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9BCB3C',
    cancelButtonColor: '#EE0E51',
    confirmButtonText: 'Yes, Restart Game!'
  }).then(function(isConfirm) {
    if (isConfirm) {
      restartBackgroundMusic();
      initGame();
    }
  })
});

$deck.on('click', '.card:not(".match, .open")', function() {
	if($('.show').length > 1) { return true; }
	
	var $this = $(this),
			card = $this.context.innerHTML;
  $this.addClass('open show');
	opened.push(card);
	
  if (opened.length > 1) {
    if (card === opened[0]) {
      $deck.find('.open').addClass('match animated infinite rubberBand');
      setTimeout(function() {
        $deck.find('.match').removeClass('open show animated infinite rubberBand');
      }, delay);
      match++;
    } else {
      $deck.find('.open').addClass('notmatch animated infinite wobble');
			setTimeout(function() {
				$deck.find('.open').removeClass('animated infinite wobble');
			}, delay / 1.5);
      setTimeout(function() {
        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
      }, delay);
    }
    opened = [];
		moves++;
		setRating(moves);
		$moveNum.html(moves);
  }
	
	if (gameCardsQTY === match) {
		setRating(moves);
		var score = setRating(moves).score;
		setTimeout(function() {
			endGame(moves, score);
		}, 500);
  }
});

initGame();

