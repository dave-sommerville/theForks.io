/*-------------------------------------------------------------->
  Player Class
<--------------------------------------------------------------*/

export class Player {
  #hand = []; 
  #handDisplayText = []; 
  #handDisplayImg = [];  
  #handValue = 0; 
  #aceCount = 0;

  constructor(
    hand = [], 
    handDisplayText = [], 
    handDisplayImg = [], 
    handValue = 0, 
    aceCount = 0
  ) {
    this.#hand = hand;
    this.#handDisplayText = handDisplayText || [];
    this.#handDisplayImg = handDisplayImg || [];
    this.#handValue = handValue;
    this.#aceCount = aceCount;

    this.updateHandValue(); 
  }

  set hand(hand) {
    this.#hand = hand;
    this.updateHandValue();
  }
  set handDisplayText(handDisplayText) {
    this.#handDisplayText = handDisplayText;
  }
  set handDisplayImg(handDisplayImg) {
    this.#handDisplayImg = handDisplayImg;
  }
  set handValue(handValue) {
    this.#handValue = handValue;
  }
  set aceCount(aceCount) {
    this.#aceCount = aceCount;
  }

  get hand() {
    return this.#hand;
  }
  get handDisplayText() {
    return this.#handDisplayText;
  }
  get handDisplayImg() {
    return this.#handDisplayImg;
  }
  get handValue() {
    return this.#handValue;
  }
  get aceCount() {
    return this.#aceCount;
  }

  addCard(card, shuffledDeck) {
    if (!Array.isArray(this.#handDisplayText)) {
      this.#handDisplayText = [];
    }
    if (!Array.isArray(this.#handDisplayImg)) {
      this.#handDisplayImg = [];
    }
    this.#hand.push(card); 
    this.#handDisplayText.push(card.carddisplay);  
    this.#handDisplayImg.push(card.imgsrc); 

    const index = shuffledDeck.indexOf(card); 
    if (index !== -1) {
      shuffledDeck.splice(index, 1); 
    }

    this.updateHandValue();  
    this.updateAceCount(card); 
  }

  updateHandValue() {
    let value = 0;
    this.#aceCount = 0;

    this.#hand.forEach(card => {
      value += card.cardvalue; 
      if (card.carddisplay.includes('Ace')) {
        this.#aceCount++;  // Count aces
      }
    });

    this.#handValue = value;
    while (this.#handValue > 21 && this.#aceCount > 0) {
      this.#handValue -= 10;
      this.#aceCount--; 
    }
  }

  updateAceCount(card) {
    if (card.carddisplay.includes('Ace')) {
      this.#aceCount++;
    }
  }
}
