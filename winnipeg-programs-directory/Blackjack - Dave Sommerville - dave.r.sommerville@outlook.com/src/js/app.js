'use strict';
import { cardObjects } from "./deck.js";
import { select, listen, createImage, shuffle, sleep } from "./utils.js";
import { Player } from "./class.js";

/*-------------------------------------------------------------->
  Initial Declarations 
<--------------------------------------------------------------*/

const dealerDisplay = select('.dealer-display');
const dealerValueDisplay = select('.dealer-value-display');
const dealerImgDisplay = select('.dealer-image-wrapper');
const dealerInfoDisplay = select('.dealer-info');
const dealerInfoButton = select('.dealer-btn');
const playerInfoDisplay = select('.player-info');
const playerInfoButton = select('.player-btn');
const finalResultDisplay = select('.final-result-display');
const playerDisplay = select('.player-display');
const playerValueDisplay = select('.player-value-display');
const playerImgDisplay = select('.player-image-wrapper');
const startButton = select('.start-btn');
const hitButton = select('.hit-btn');
const holdButton = select('.hold-btn');
const doubleButton = select('.double-btn');
const restartButton = select('.restart-btn');
const increaseBetTen = select('.bet10');
const increaseBetFifty = select('.bet50');
const increaseBetHundred = select('.bet100');
const decreaseBetTen = select('.down10');
const decreaseBetFifty = select('.down50');
const decreaseBetHundred = select('.down100');
const allInButton = select('.all-in');
const placeBet = select('.place-bet');
const betScreen = select('.bet-banking-area');
const bankDisplay = select('.player-bank');
const fundsDisplay = select('.funds-display');
const sideBankDisplay = select('.side-bank-display');
const bankWrapper = select('.bank-wrapper');
const totalPlayerBet = select('.pot');
const sidePlayerBet = select('.side-pot');
const adButton = select('.ad-btn');

const clickFX = select('.click-fx');
const shuffleFX = select('.shuffle-fx');
const coinFX = select('.coin-fx');
const winningFX = select('.winning-fx');
const allInFX = select('.all-in-fx');
const adDisplay = select('.ad-display');
const progressBar = select('.progress-bar');
const timerText = select('.timer-text');

/*-------------------------------------------------------------->
Specialty Functions
<--------------------------------------------------------------*/
let shuffledDeck = shuffle([...cardObjects]);

const player = new Player();
const dealer = new Player();

let playerBank = 1000;
let playerBetTotal = 0;
let pot = 0;

let convert = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6)
      return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9)
      return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12)
      return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

/*-------------------------------------------------------------->
  Display Functions 
<--------------------------------------------------------------*/
function hideActionButtons() {
  hitButton.classList.add('hidden');
  holdButton.classList.add('hidden');
  if (!doubleButton.classList.contains('hidden'))
    doubleButton.classList.add('hidden');
}

function hideDealShowAction() {
  hitButton.classList.remove('hidden');
  holdButton.classList.remove('hidden');
  doubleButton.classList.remove('hidden');

  startButton.classList.add('hidden');
}

function updateDisplayImages(images, imageWrapper) {
  imageWrapper.innerHTML = '';  

  images.forEach(imageSrc => {
    let imgElement = createImage(imageSrc);
    imageWrapper.appendChild(imgElement);
  });
}

function dealerFirstDisplay () {
  const li = document.createElement('li'); 
  li.textContent = dealer.handDisplayText[0];; 
  dealerDisplay.appendChild(li); 
  updateDisplayImages(dealer.handDisplayImg.slice(0, 1), dealerImgDisplay);
}

function updateDisplay(player, targetUL, targetImgDis) {
  targetUL.innerHTML = ''; 
  player.handDisplayText.forEach((text) => {
    const li = document.createElement('li'); 
    li.textContent = text; 
    targetUL.appendChild(li); 
  });
  updateDisplayImages(player.handDisplayImg, targetImgDis);  
}

function updateBankDisplay() {
  let convertedBank = convert(playerBank);
  bankDisplay.textContent = `${convertedBank}`;
  sideBankDisplay.textContent = `${convertedBank}`;
  localStorage.setItem('playerBank', playerBank); // Save to local storage
}


function updateTotalBet() {
  let convertedBet = convert(playerBetTotal);
  totalPlayerBet.textContent = `${convertedBet}`;
  sidePlayerBet.textContent = `${convertedBet}`;
}

/*-------------------------------------------------------------->
  Gameplay Functions 
<--------------------------------------------------------------*/

function startingDeal() {
  player.addCard(shuffledDeck[0], shuffledDeck);
  dealer.addCard(shuffledDeck[0], shuffledDeck);
  player.addCard(shuffledDeck[0], shuffledDeck);
  dealer.addCard(shuffledDeck[0], shuffledDeck);
  if (isBlackJack()) {
    blackJackPayout();
  } else {
    hideDealShowAction();
  }
  if (player.handValue[0] === player.handValue[1]) {
    console.log('split?');
  }
  updateDisplay(player, playerDisplay, playerImgDisplay);
  playerValueDisplay.textContent = player.handValue;
  dealerFirstDisplay();
}

function isBlackJack() {
  if (player.handValue === 21) {
    return true;
  } else {
    return false;
  }
}

function blackJackPayout() {
  pot *= 1.5;
  playerBank = playerBank + pot;
  pot = 0;
  playerBetTotal = 0;
  updateBankDisplay();
  hideActionButtons();
  startButton.classList.remove('hidden');
  finalResultDisplay.textContent = 'You got a Blackjack'
}

function hit(handObj) {
  handObj.addCard(shuffledDeck[0], shuffledDeck);
  bustCheck(handObj);
}

function dealerTurn() {
  while (dealer.handValue < 17) {
    hit(dealer);
  }
  updateDisplay(player, playerDisplay, playerImgDisplay); 
  updateBankDisplay();
  playerValueDisplay.textContent = player.handValue;
}

function endGame() {
  hideActionButtons();
  pot = 0;
  playerBetTotal = 0;
  totalPlayerBet.textContent = '';
  sidePlayerBet.textContent = '';
}

function bustCheck(handObj) {
  if (handObj.handValue > 21) {  
      if (handObj === player) {
        finalResultDisplay.textContent = 'YOU BUSTED! YOU LOSE!';
        restartButton.classList.remove('hidden');
        isBankrupt();
        endGame();
      } else if (handObj === dealer) {
        finalResultDisplay.textContent = 'DEALER BUSTS! YOU WIN!';
        winningFX.play();
        playerBank += pot;
        updateBankDisplay();
        endGame();
        restartButton.classList.remove('hidden');
      }
  }
}

function dealerCheck() {
  if (dealer.handValue > 21) {
    finalResultDisplay.textContent = 'DEALER BUSTS! YOU WIN!';
    winningFX.play();
    playerBank += pot;
    updateBankDisplay();
  } else if (dealer.handValue > player.handValue) {
    finalResultDisplay.textContent = 'DEALER WINS!';
  } else if (dealer.handValue < player.handValue) {
    finalResultDisplay.textContent = 'YOU WIN!';
    winningFX.play();
    playerBank += pot; 

  } else {
    finalResultDisplay.textContent = 'PUSH';
    playerBank += playerBetTotal; 
  }
}

function finalResult() {
  updateDisplay(dealer, dealerDisplay, dealerImgDisplay);
  dealerCheck();
  restartButton.classList.remove('hidden');
  isBankrupt();
  updateBankDisplay();
  endGame();
}

function resetGame() {
  player.hand = [];
  player.handValue = 0;
  player.aceCount = 0;
  player.handDisplayImg = [];
  player.handDisplayText = [];

  dealer.hand = [];
  dealer.handValue = 0;
  dealer.aceCount = 0;
  dealer.handDisplayImg = [];
  dealer.handDisplayText = []; 

  shuffledDeck = shuffle([...cardObjects]);

  finalResultDisplay.textContent = '';
  playerDisplay.textContent = '';
  playerValueDisplay.textContent = '';
  dealerDisplay.textContent = '';

  updateBankDisplay();
  updateTotalBet();
}

/*-------------------------------------------------------------->
  Button Functions 
<--------------------------------------------------------------*/
function potDecrease(value) {
  fundsDisplay.textContent = '';
  if (playerBetTotal >= value) { 
    playerBetTotal -= value; 
    playerBank += value; 
    updateBankDisplay();
    updateTotalBet();
  }
}

function potIncrease(value) {
  if (playerBank >= value) { 
    playerBetTotal += value; 
    playerBank -= value; 
    updateBankDisplay();
    updateTotalBet();
  } else {
    fundsDisplay.textContent = 'Not enough funds to increase bet!';
  }
}

function allIn() {
  if (playerBank > 0) {
    playerBetTotal += playerBank;
    playerBank = 0;
    updateBankDisplay();
    updateTotalBet();
  } else {
    fundsDisplay.textContent = 'Not enough funds to increase bet!';
  }
}

function setBet() {
  pot = playerBetTotal * 2; 
  if (pot <= 0) {
    totalPlayerBet.textContent = 'required';  
    return;
  }
  betScreen.classList.remove('visible');
  bankWrapper.classList.add('visible');
  startBtn();
}

function startBtn() {
  resetGame()
  finalResultDisplay.textContent = 'DEALING...';
  shuffleFX.play();
  setTimeout(() => {
    finalResultDisplay.textContent = '';
    startingDeal();
  }, 1000);
}

function hitBtn() {
  hit(player);
  doubleButton.classList.add('hidden');
  updateDisplay(player, playerDisplay, playerImgDisplay);
  playerValueDisplay.textContent = player.handValue;
}

function holdBtn() {
  dealerTurn();
  finalResult();
}

function doubleBtn() {
  if (playerBank >= playerBetTotal) {
    playerBank -= playerBetTotal;
    pot += playerBetTotal;
    playerBetTotal *= 2;
    updateBankDisplay();
    updateTotalBet();

    player.addCard(shuffledDeck[0], shuffledDeck);
    updateDisplay(player, playerDisplay, playerImgDisplay);
    playerValueDisplay.textContent = player.handValue;

    bustCheck(player); 
    hideActionButtons(); 
    if (player.handValue <= 21) {
      dealerTurn();
      finalResult();
    }
  } else {
    finalResultDisplay.textContent = "Not enough bank to double!";
  }
}

function restartBtn() {
  betScreen.classList.add('visible');
  bankWrapper.classList.remove('visible');
  restartButton.classList.add('hidden');
  finalResultDisplay.textContent = '';
  playerImgDisplay.innerHTML = '';
  dealerImgDisplay.innerHTML = '';
}

function advertBtn() {
  winningFX.play();
  restartButton.classList.remove('hidden');
  adDisplay.classList.add('visible');
  adButton.classList.add('hidden');
  bankDisplay.classList.remove('hidden');
  playerBank += 1000;
  startTimer(5);
  updateBankDisplay(); 
}

/*-------------------------------------------------------------->
  Ad Display
<--------------------------------------------------------------*/
function isBankrupt() {
  if (playerBank <= 0) {
    adButton.classList.remove('hidden');
    bankDisplay.classList.add('hidden');
  }
}

function startTimer(durationInSeconds) {
    let timeRemaining = durationInSeconds;
    const interval = 50; 
    const totalTime = timeRemaining * 1000; 
    let elapsedTime = 0;

    const timer = setInterval(() => {
        elapsedTime += interval;
        const progress = (elapsedTime / totalTime) * 100;
        progressBar.style.width = `${progress}%`;
        if (elapsedTime % 1000 === 0) {
            timeRemaining -= 1;
            timerText.textContent = timeRemaining > 0 ? timeRemaining : "Time's up!";
        }
        if (timeRemaining <= 0) {
            adDisplay.classList.remove('visible');
        }
        if (elapsedTime >= totalTime) {
            clearInterval(timer);
        }
    }, interval);
}

/*-------------------------------------------------------------->
  Page Load and Listeners
<--------------------------------------------------------------*/

listen('load', window, () => {
  const savedBank = localStorage.getItem('playerBank');
  playerBank = savedBank ? parseInt(savedBank, 10) : 1000; // Default to 1000 if no saved value
  updateBankDisplay();
  isBankrupt();
  betScreen.classList.add('visible');
});


listen('click', startButton, () => { 
  startBtn();
  clickFX.play();
}); 

listen('click', hitButton, () => {
  hitBtn();
  clickFX.play();
});

listen('click', doubleButton, () => {
  doubleBtn();
  clickFX.play();
});

listen('click', holdButton, () => {
  holdBtn();
  clickFX.play();
});

listen('click', increaseBetTen, () => {
  potIncrease(10);
  coinFX.play();
});

listen('click', increaseBetFifty, () => {
  potIncrease(50);
  coinFX.play();
});

listen('click', increaseBetHundred, () => {
  potIncrease(100);
  coinFX.play();
});

listen('click', decreaseBetTen, () => {
  potDecrease(10);
  coinFX.play();
});

listen('click', decreaseBetFifty, () => {
  potDecrease(50);
  coinFX.play();
});

listen('click', decreaseBetHundred, () => {
  potDecrease(100);
  coinFX.play();
});

listen('click', allInButton, () => {
  allIn();
  allInFX.play();
});

listen('click', placeBet, () => {
  setBet();
  clickFX.play();
});

listen('click', restartButton, () => {
  restartBtn();
  clickFX.play();
});

listen('click', adButton, () => {
  advertBtn();
});

listen('click', dealerInfoButton, () => {
  dealerInfoDisplay.classList.toggle('growth');
});

listen('click', playerInfoButton, () => {
  playerInfoDisplay.classList.toggle('growth');
});
