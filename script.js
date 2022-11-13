import birdsData from "./data.js"

function showQuestion(data, shuffledArray, step){
  for(let i = 0; i < data.length; i++){
    if(data[i].id == shuffledArray[step] + 1){
      questionSound.src = data[i].audio;
    }
  }
}

const aside = document.querySelector(".aside");
const game = document.querySelector(".game");

const variants = document.querySelectorAll(".variants__item");
variants.forEach((element) => {
  element.addEventListener("click", (e) => {
    if(clickFlag == 1){
    let id = e.currentTarget.dataset.id;
    drawAnswer(gameQuiz[id - 1]);
    if(checkAnswer(id, shuffledList[gameStep] + 1)){
      e.currentTarget.classList.add("right");
      questionImage.src = gameQuiz[id - 1].image;
    } else {
      e.currentTarget.classList.add("wrong");
      questionImage.src = "./assets/images/unknownbird.jpg";
    }
    clickFlag = 0;
    }
  });
});

const questionSound = document.querySelector(".question__voice");
const questionImage = document.querySelector(".question__image");
const answerContainer = document.querySelector(".answer");
const answerSound = document.querySelector(".answer__voice");
const scoreContainer = document.querySelector(".game__score");

let type = 0;
let gameQuiz = birdsData[type];
let shuffledList = [];
let gameStep = 0;
let gameScore = 0;
let clickFlag = 1;

const gameTypes = document.querySelectorAll(".menu__item");
gameTypes.forEach((element) => {
    element.addEventListener("click", (e) => {
    type = e.currentTarget.dataset.type;
    gameQuiz = birdsData[type];
    aside.classList.add("hide");
    game.classList.remove("hide");
    shuffledList = CreateShuffledList(gameQuiz.length);
    drawVariants(gameQuiz, variants);
    showQuestion(gameQuiz, shuffledList, gameStep);
    });
});

function drawVariants(data, target){
    for(let i = 0; i < data.length; i++) {
      target[i].innerText = data[i].name;
      target[i].dataset.id = data[i].id;
      if(target[i].classList.contains("wrong")){
        target[i].classList.remove("wrong");
      }
      if(target[i].classList.contains("right")){
        target[i].classList.remove("right");
      }
    }
}

function drawAnswer(data){
  answerContainer.innerHTML = `
  <div class="answer__picture">
      <img class="answer__image" src="${data.image}" alt="answer image">
  </div>
  <div class="answer__description">
      <h2 class="answer__title">${data.name} - ${data.species}</h2>
      <audio class="answer__voice"
          src="${data.audio}"
          controls></audio>
      <div class="answer__text">
          <p>${data.description}</p>
      </div>
  </div>
  `;
}

function checkAnswer(clickedID, questionID){
  if(clickedID == questionID){
    gameScore++;
    scoreContainer.innerText = `SCORE ${gameScore} / ${shuffledList.length}`;
    return true;
  }
}

const nextButton = document.querySelector(".next__button");
nextButton.addEventListener("click", nextStep);

function nextStep(){
  gameStep++;
  if(gameStep < shuffledList.length){
      showQuestion(gameQuiz, shuffledList, gameStep);
  answerContainer.innerHTML = "<p>Choose you variant to check it out</p>";
  drawVariants(gameQuiz, variants);
  clickFlag = 1;
  } else {
    game.innerText = `Your score is ${gameScore} / ${shuffledList.length}\n You could start again after at least 5 seconds :)`;
    setTimeout(() => {
       type = 0;
    gameQuiz = birdsData[type];
    shuffledList = [];
    gameStep = 0;
    gameScore = 0;
    clickFlag = 1;
    window.location.reload(true);
    }, 5000);
  }

}

// create random list
function CreateShuffledList(itemsCount) {
    let randomArray = [];
    for (let i = 0; i < itemsCount; i++) {
        randomArray.push(i);
    }
    FisherYets(randomArray);
    return randomArray;
}

// fisher-yets algorithm to shuffle array
function FisherYets(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
}


