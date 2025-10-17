/*
 * Name: Harry CHeng
 * Date: 10/12/2025
 * Section: CSE 154 AA
 *
 * This is the JS file for the memory-challenging game “Find the Same”.
 * It fills out the game board with randoom paring cards, tracks the player’s finishing time,
 * handles flips and matches, calls in the start at the biginning, and triger the end dialog when
 * the game is finished.
 */
"use strict";
(function() {
  const CARDS = ["img/cat.png", "img/dog.png", "img/deer.png", "img/chipmunk.png",
    "img/elephant.png", "img/gorilla.png", "img/monkey.png", "img/octopus.png", "img/rat.png",
    "img/whale.png"];

  let timer = null;
  const MILISEC = 1000;
  const SIXTY = 60;
  const TEN = 10;

  const PAUSE = 1500; // in millisecond

  // to generate alternative text for images, catch the key word of the link with slice()
  const CHARBEFORE = 4;
  const CHARAFTER = -4;

  window.addEventListener("load", init);

  /**
   * Initialize the game:
   *  Active the start screen
   *  Assign random pairs of card on the game board
   *  Prepare "reset" button
   */
  function init() {
    startScreenActive();
    randomCardFrontAssign();
    qs("#info-bar button").addEventListener("click", reset);
  }

  /**
   * Active the start screen and wait for the user to click "start" to start the count down.
   */
  function startScreenActive() {
    let startScreen = id("overlay-start-screen");
    startScreen.showModal();
    qs("#overlay-start-screen button").addEventListener("click", () => {
      startScreen.close();
      countDown();
    });
  }

  /**
   * Set a count down timer. Only does minute and second with a pattern of "00:00".
   */
  function countDown() {
    let startTime = new Date().getTime();
    timer = setInterval(() => {
      let currentTime = new Date().getTime();
      let elapsedTime = Math.floor((currentTime - startTime) / MILISEC);

      let minute = Math.floor(elapsedTime / SIXTY);
      let second = elapsedTime % SIXTY;
      if (minute < TEN) {
        minute = "0" + minute;
      }
      if (second < TEN) {
        second = "0" + second;
      }
      qs("#timer em").textContent = minute + ":" + second;
    }, MILISEC);
  }

  /**
   * Turn a head-down card to head-up. Also triger the match ckecking and win checking.
   */
  function cardTurn() {
    if (qsa(".flipped").length === 2 ) {
      return;
    }
    let back = this;
    let front = this.nextElementSibling;

    back.classList.toggle("hide");
    front.classList.toggle("hide");

    front.classList.add("flipped");

    checkMatch();

    checkWin();
  }

  /**
   * Check whether all pairs are done. If so, calls an end to the game
   */
  function checkWin() {
    if (qsa(".matched").length === qsa(".card").length) {
      endGame();
    }
  }

  /**
   * Check if the two flipped card are match. If so, keep them head-up and add match-count. If
   * not, turn the two cards down after a short pause.
   */
  function checkMatch() {
    let flippedCards = qsa(".flipped");
    if (flippedCards.length === 2) {
      let card1 = flippedCards[0];
      let card2 = flippedCards[1];
      if (card1.src === card2.src) {
        card1.classList.replace("flipped", "matched");
        card2.classList.replace("flipped", "matched");

        qs("#match-count em").textContent = qsa(".matched").length / 2;
      } else {
        setTimeout(() => {
          card1.classList.replace("flipped", "hide");
          card1.previousElementSibling.classList.toggle("hide");
          card2.classList.replace("flipped", "hide");
          card2.previousElementSibling.classList.toggle("hide");
        }, PAUSE);
      }
    }
  }

  /**
   * End the game by calling in the end screen. Wait the user to click either "Yes" for second
   * round or "No" to return to the finished game.
   */
  function endGame() {
    clearInterval(timer);
    id("end-time").textContent = qs("#timer em").textContent;
    id("end-match-count").textContent = qs("#match-count em").textContent;
    let endScreen = id("overlay-end-screen");
    endScreen.showModal();
    id("again").addEventListener("click", () => {
      endScreen.close();
      reset();
    });
    id("stay").addEventListener("click", () => {
      endScreen.close();
    });
  }

  /**
   * Reset timer, match-count, and game board. The card set will be different.
   */
  function reset() {
    id("game-board").innerHTML = "";
    clearInterval(timer);
    qs("#timer em").textContent = "00:00";
    qs("#match-count em").textContent = "0";
    randomCardFrontAssign();
    qsa(".back").forEach(img => {
      img.addEventListener("click", cardTurn);
    });
    countDown();
  }

  /**
   * Random assign emoji to the front of the cards. In other word, "shuffle the card".
   */
  function randomCardFrontAssign() {
    for (let i = 0; i < CARDS.length * 2; i++) {
      let cards = qsa(".card");
      let cardIndex = Math.floor(i / 2);
      let htmlIndex = getRandomInt(cards.length);

      let front = gen("img");
      front.src = CARDS[cardIndex];
      front.alt = "A cute " + CARDS[cardIndex].slice(CHARBEFORE, -CHARAFTER) + " emoji";
      front.classList.add("front", "hide");

      let back = gen("img");
      back.src = "img/card-back.png";
      back.alt = "A cool designed back of the card";
      back.classList.add("back");
      back.addEventListener("click", cardTurn);

      let card = gen("article");
      card.classList.add("card");
      card.appendChild(back);
      card.appendChild(front);

      let gameBoard = id("game-board");
      if (htmlIndex === cards.length) {
        gameBoard.appendChild(card);
      } else {
        gameBoard.insertBefore(card, cards[htmlIndex]);
      }
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Returns a element with the given tagname.
   * @param {string} tagname - HTML element tagname
   * @returns {object[]} a HTML element that hasn't bind with DOM yet.
   */
  function gen(tagname) {
    return document.createElement(tagname);
  }

  /**
   * Returns an random interger ranging from 0 to max.
   * @param {string} max - the largest ipossible integer
   * @returns {integer} an integer ranging from 0 to max
   */
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
})();
