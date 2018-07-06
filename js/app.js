/*
 * Create a list that holds all of the cards
 */

// number of matching for each seperate card on the game
const repeatNum = 2;

// number of player moves
let numMoves = 0;

// A reference to Moves span
const moves = document.querySelector('.moves');

// A reference to restart button
const restartButton = document.querySelector('.restart');

// construct array to hold all the game cards 
const cards = [];

// A list of opened cards
const openedCards = [];

// Group of font-awesome icons represents the matched card images
const cardIcons = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt",
	"fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

// Intialize the final cards of the current game
const finalCards = constructCards();

// A reference to the score panel
const scorePanel = document.querySelector('.score-panel');

// A reference to the deck contains the game cards to append cards to it
const deck = document.querySelector('.deck');

// A reference to finished game message
const finished = document.querySelector('.finished');

// A reference to play again button
const playAgain = document.querySelector('.play-again');

// A reference to timer container tag (div#timer)
const eTimer = document.getElementById('timer');

// Stars container reference
const stars = document.querySelector('.stars').querySelectorAll('li');

// Right Gueses
let rightGuesses = 0;

// Check timer condition
let isTimerOn = false;

// Time interval holder
var timerVal;

// add final current game cards to the deck
addGameCards(finalCards);

// add reset event listener to reset button
restartButton.addEventListener('click', reset);

// add event listener to "Play Again" button
playAgain.addEventListener('click', reset);


// construct array to hold the random cards of the current game
function constructCards() {
	for (let i = 0; i < repeatNum; i++) {
		for(let x = 0; x < cardIcons.length; x++) {
			const newIcon = document.createElement('i');
			newIcon.classList.add("fa", cardIcons[x]);
			const newCard = document.createElement('li');
			newCard.classList.add("card");
			newCard.appendChild(newIcon);
			cards.push(newCard);
		}	
	}
	return (shuffle(cards));
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Add the current game cards to the deck
function addGameCards (array) {
	const fragment = document.createDocumentFragment();
	for (let i = 0; i < array.length; i++) {
		cards[i].addEventListener('click', respondeToCardClick);
		fragment.appendChild(cards[i]);

	}
	deck.appendChild(fragment);
}

// Call this function if card was clicked by user
function respondeToCardClick (event) {
	if(isTimerOn === false) {
		startTimer();
		isTimerOn = true;
	}
	const target = event.target;
	target.removeEventListener('click', respondeToCardClick);
	if (target.tagName.toLowerCase() == 'li') {
		target.className = 'card open show';
		addOpenedCard(event.target);
	}	
}

// Check user guess
function addOpenedCard (card) {
	openedCards.push(card);
	if (openedCards.length > 1) {
		const firstCard = openedCards[0];
		const secondCard = openedCards[1];
		if (firstCard.isEqualNode(secondCard)) {
			lockCards(firstCard, secondCard);
			rightGuesses += 1;
			if (rightGuesses == finalCards.length/2) {
				endGame();
			}
		} else if (openedCards.length > 1) {
			resetCards(firstCard, secondCard);
		}
	}
}

// Call this function if user guessed right matches
function lockCards(firstCard, secondCard) {
	console.log("Equal");
	firstCard.className = 'card match';
	secondCard.className = 'card match';
	addMove();
	openedCards.splice(0);
}

// Call this card if user guessed wrong matches
async function resetCards(firstCard, secondCard) {
	await sleep(400);
	firstCard.className = 'card';
	secondCard.className = 'card';
	firstCard.addEventListener('click', respondeToCardClick);
	secondCard.addEventListener('click', respondeToCardClick);
	addMove();
	openedCards.splice(0);
}

// Increase number of user moves
function addMove() {
	numMoves +=1;
	moves.innerText = numMoves;
	starsCalculator();
}

// Calculate and update stars
function starsCalculator() {
	if (numMoves >= 16 && numMoves <= 20) {
		stars[2].firstChild.className="fa fa-star-o";
	} else if (numMoves >= 21) {
		stars[1].firstChild.className="fa fa-star-o";
	}
}

// Reset the game
function reset() {
	const cardsArray= document.querySelector('.deck').querySelectorAll('li');
	for (card of cardsArray) {
		card.className = 'card';
		card.addEventListener('click', respondeToCardClick);
	}
	openedCards.splice(0);
	numMoves = 0;
	isTimerOn = false;
	moves.innerText = numMoves;
	scorePanel.style.display = 'block';
	deck.style.display = 'flex';
	finished.style.display= 'none';
	resetStars();
	clearInterval(timerVal);
	eTimer.innerHTML = '';
	isTimerOn = false;
	console.log(isTimerOn);
}

// Reset star shapes
function resetStars() {
	stars[2].firstChild.className="fa fa-star";
	stars[1].firstChild.className="fa fa-star";
}

// Pause the excution for a while (https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// End the game if user guessed all cards correctly
async function endGame() {
	gameStatistics();
	await sleep(200);
	scorePanel.style.display = 'none';
	deck.style.display = 'none';
	finished.style.display= 'flex';
}

// Get final statistics of the game
function gameStatistics() {
	const numStars = document.querySelectorAll('.fa-star').length;
	document.querySelector('.final-moves').innerText = numMoves;
	document.querySelector('.final-stars').innerText = numStars;
}

// Create game timer
function startTimer() {
	timerVal = setInterval(timer, 1000);
	let totalSeconds = 0;
	function timer() {
		++totalSeconds;
		let hours = Math.floor(totalSeconds/3600); //Count hours
		let minutes = Math.floor((totalSeconds - hours*3600) / 60); //Count mionutes
		let seconds = totalSeconds - (hours * 3600 + minutes * 60); //Count seconds
		eTimer.innerHTML = hours + ':' + minutes + ':' + seconds; //put the result on #timer div
	}
}