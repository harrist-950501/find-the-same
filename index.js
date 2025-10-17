"use strict";
(function() {
  // const CARDS = ["img/cat.png", "img/dog.png", "img/deer.png", "img/chipmunk.png",
  //   "img/elephant.png", "img/gorilla.png", "img/monkey.png", "img/octopus.png", "img/rat.png",
  //   "img/whale.png"];
  const CARDS = ["img/cat.png", "img/dog.png"];

  let timer = null;

  window.addEventListener("load", init);

  function init() {
    startScreenActive();
    randomCardFrontAssign();
    qsa(".back").forEach(img => {img.addEventListener("click", cardTurn);});
    qs("#info-bar button").addEventListener("click", reset);
  }

  function startScreenActive() {
    let start_screen = id("overlay-start-screen");
    start_screen.showModal();
    qs("#overlay-start-screen button").addEventListener("click", () => {
      start_screen.close();
      countDown();
    });
  }

  function countDown() {
      let startTime = new Date().getTime();
      timer = setInterval(() => {
        let currentTime = new Date().getTime();
        let elapsedTime = Math.floor((currentTime - startTime) / 1000);

        let minute = Math.floor(elapsedTime / 60);
        let second = elapsedTime % 60;
        if(minute < 10) {
          minute = "0" + minute;
        }
        if(second < 10) {
          second = "0" + second;
        }
        qs("#timer em").textContent = minute + ":" + second;
      }, 1000);
  }


  function cardTurn() {
    // No flipping during the 1.5 seconds pause
    if(qsa(".flipped").length === 2 ) {
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

  function checkWin() {
    if(qsa(".matched").length === qsa(".card").length) {
      endGame();
    }
  }

  function checkMatch() {
    let flippedCards = qsa(".flipped");
    if(flippedCards.length === 2) {
      let card1 = flippedCards[0];
      let card2 = flippedCards[1];
      if(card1.src === card2.src) {
        card1.classList.replace("flipped", "matched");
        card2.classList.replace("flipped", "matched");

        qs("#match-count em").textContent = qsa(".matched").length / 2;
        return true;
      } else {
        setTimeout(() => {
          card1.classList.replace("flipped", "hide");
          card1.previousElementSibling.classList.toggle("hide");
          card2.classList.replace("flipped", "hide");
          card2.previousElementSibling.classList.toggle("hide");
        }, 1500);
        // give a 1.5 seconds pause for memorizing the location
      }
    }
    return false;
  }

  function endGame() {
    clearInterval(timer);
    id("end-time").textContent = qs("#timer em").textContent;
    id("end-match-count").textContent = qs("#match-count em").textContent;
    let end_screen = id("overlay-end-screen");
    end_screen.showModal();
    id("again").addEventListener("click", () => {
      end_screen.close();
      reset();
    });
    id("stay").addEventListener("click", () => {
      end_screen.close();
    });
  }

  function reset() {
    id("game-board").innerHTML = "";
    clearInterval(timer);
    qs("#timer em").textContent = "00:00";
    qs("#match-count em").textContent = "0";
    randomCardFrontAssign();
    qsa(".back").forEach(img => {img.addEventListener("click", cardTurn);});
    countDown();
  }

  function randomCardFrontAssign() {
    for(let i = 0; i < CARDS.length * 2; i++) {
      let cards = qsa(".card");
      let cardIndex = Math.floor(i / 2);
      let htmlIndex = getRandomInt(cards.length);

      let front = gen("img");
      front.src = CARDS[cardIndex];
      front.alt = "A cute " + CARDS[cardIndex].slice(4, -4) + " emoji";
      front.classList.add("front", "hide");

      let back = gen("img");
      back.src = "img/card-back.png";
      back.alt = "A cool designed back of the card";
      back.classList.add("back");

      let card = gen("article");
      card.classList.add("card");
      card.appendChild(back);
      card.appendChild(front);

      let gameBoard = id("game-board");
      if(htmlIndex === cards.length) {
        gameBoard.appendChild(card);
      } else {
        gameBoard.insertBefore(card, cards[htmlIndex]);
      }
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
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