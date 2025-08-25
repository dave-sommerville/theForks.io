'use strict';

/*-------------------------------------------------------------->
Utility Functions 
<--------------------------------------------------------------*/
export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

export function createImage(imageSrc) {
  const img = document.createElement('img');
  img.src = imageSrc;  
  img.alt = imageSrc; // Because the photo could be anything 
  return img;
}

export function shuffle(deck) {
  const shuffledDeck = [...deck]; 
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]]; 
  }
  return shuffledDeck;
}

export function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}
