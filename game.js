var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
let bombs = [];
let bombTotalCount = 0;
let playerHealth = 3;
const screenWidth = screen.availWidth;
// getting screen available Width
let totalPlayingTime = 0;

let levelCard = document.createElement("div");
levelCard.className = "alert";
levelCard.style.position = "absolute";
levelCard.style.left = "0px";
levelCard.style.top = "0px";
levelCard.innerHTML = "Level ";
levelCard.style.backgroundColor = "white";
levelCard.style.padding = "20px";
let level = document.createElement("span");
level.id = "current-level";
levelCard.appendChild(level);
document.body.appendChild(levelCard);

// for level card

let currentLevel = 0;
let levels = [
  {
    speed: 1,
    totalBomb: 50,
  },
  {
    speed: 2,
    totalBomb: 200,
  },
  {
    speed: 3,
    totalBomb: 300,
  },
  {
    speed: 4,
    totalBomb: 400,
  },
  {
    speed: 6,
    totalBomb: 500,
  },
];
// for determining total bomb and speed

const bombBlastTop = 620;
const bombBlastBottom = bombBlastTop + 41;
// for ground

function keyup(event) {
  var player = document.getElementById("player");
  if (event.keyCode == 37) {
    leftPressed = false;
    lastPressed = "left";
  }
  if (event.keyCode == 39) {
    rightPressed = false;
    lastPressed = "right";
  }
  if (event.keyCode == 38) {
    upPressed = false;
    lastPressed = "up";
  }
  if (event.keyCode == 40) {
    downPressed = false;
    lastPressed = "down";
  }

  player.className = "character stand " + lastPressed;
}

function move() {
  var player = document.getElementById("player");
  var positionLeft = player.offsetLeft;
  var positionTop = player.offsetTop;
  if (downPressed) {
    var newTop = positionTop + 1;

    var element = document.elementFromPoint(player.offsetLeft, newTop + 32);
    if (element.classList.contains("sky") == false) {
      player.style.top = newTop + "px";
    }

    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = "character walk down";
      }
    }
  }
  if (upPressed) {
    var newTop = positionTop - 1;

    var element = document.elementFromPoint(player.offsetLeft, newTop - 7.7);
    if (element.classList.contains("sky") == false) {
      player.style.top = newTop + "px";
    }

    if (leftPressed == false) {
      if (rightPressed == false) {
        player.className = "character walk up";
      }
    }
  }
  if (leftPressed) {
    var newLeft = positionLeft - 1;

    var element = document.elementFromPoint(newLeft, player.offsetTop);
    if (element.classList.contains("sky") == false) {
      player.style.left = newLeft + "px";
    }

    player.className = "character walk left";
  }
  if (rightPressed) {
    var newLeft = positionLeft + 1;

    var element = document.elementFromPoint(newLeft + 32, player.offsetTop);
    if (element.classList.contains("sky") == false) {
      player.style.left = newLeft + "px";
    }

    player.className = "character walk right";
  }
}

function keydown(event) {
  if (event.keyCode == 37) {
    leftPressed = true;
  }
  if (event.keyCode == 39) {
    rightPressed = true;
  }
  if (event.keyCode == 38) {
    upPressed = true;
  }
  if (event.keyCode == 40) {
    downPressed = true;
  }
}
function myLoadFunction() {
  timeout = setInterval(move, 10);
  document.addEventListener("keydown", keydown);
  document.addEventListener("keyup", keyup);
}
function samyam() {
  document.getElementById("start").style.display = "none";
  starship(); //this is the code to start the movement of space ship after pressing start
  atomBomb();
}
function kill() {
  var press = document.getElementById("start");
  press.addEventListener("click", samyam); //start the game afer buttom pressed
}
const left = (min, max) => Math.floor(Math.random() * (max - min) + 1) + min; //spaceship  move at the top of the screen
function starship() {
  setInterval(() => {
    let alien = document.getElementById("alien");
    alien.style.left = left(0, screenWidth - 100) + "px"; //spaceship moves  itself towards left
    alien.style.top = "15px"; // makes spaceship at the top if the screen
    console.log(levels[currentLevel].totalBomb);
    if (bombs.length <= levels[currentLevel].totalBomb) {
      var bomb = document.createElement("div");
      bomb.id = `bomb-${bombTotalCount}`;
      bombTotalCount++;
      if (bombTotalCount > 20) {
        currentLevel = 1;
      }
      if (bombTotalCount > 30) {
        currentLevel = 2;
      }
      if (bombTotalCount > 50) {
        currentLevel = 3;
      }
      if (bombTotalCount > 80) {
        currentLevel = 4;
      }
      // update game level
      document.getElementById("current-level").innerText = currentLevel + 1;
      bomb.className = "bomb";
      bomb.style.position = "absolute";
      bomb.style.left = alien.style.left;
      bomb.style.top = "15px";
      document.getElementById("bombs").appendChild(bomb);
      bombs.push({
        html: bomb.id,
        left: parseInt(alien.style.left.slice(0, -2)),
        top: 15,
      });
    }
  }, 500 / levels[currentLevel].speed); //speed changes with level
}

function isColidedWithPlayer(leftDist, topDist) {
  const bombDistance = 20;
  // how to change collision
  if (
    leftDist < bombDistance &&
    leftDist >= 0 &&
    topDist < bombDistance &&
    topDist >= 0
  ) {
    return true;
  }
  return false;
}

// main function for functioning of game
function atomBomb() {
  let timer = null;
  function frame() {
    // looping all bombs in every frame
    for (let whichBomb = 0; whichBomb < bombs.length; whichBomb++) {
      let bomb = bombs[whichBomb];
      bomb.top += 40 * levels[currentLevel].speed;
      let currentBomb = document.getElementById(bomb.html);
      currentBomb.style.top = bomb.top + "px";

      // getting if collision happen or not
      const player = document.getElementById("player");
      const leftPosition = player.offsetLeft;
      const topPosition = player.offsetTop;
      let leftDist = leftPosition - bomb.left;
      let topDist = topPosition - bomb.top;
      // negative to positive
      leftDist = leftDist < 0 ? leftDist * -1 : leftDist;
      topDist = topDist < 0 ? topDist * -1 : topDist;

      if (isColidedWithPlayer(leftDist, topDist)) {
        // for changing collision
        currentBomb.className = "explosion";
        player.className = "character dead";
        // reducing player health
        playerHealth--;
        // for dead card
        let alertCard = document.createElement("div");
        alertCard.className = "alert";
        alertCard.style.position = "absolute";
        alertCard.style.left = "45%";
        alertCard.style.top = "45%";
        alertCard.innerHTML = "<h2> Player got dead boi 😐😐</h2>";
        alertCard.style.backgroundColor = "white";
        alertCard.style.padding = "20px";
        // button to continue
        let replayButton = document.createElement("button");
        replayButton.innerText = "Continue Game";
        replayButton.className = "replay";
        replayButton.style.padding = "10px";
        replayButton.style.border = "1px";
        replayButton.style.borderColor = "blue";
        replayButton.addEventListener("click", () => {
          alertCard.remove();
        });
        alertCard.appendChild(replayButton);
        document.body.appendChild(alertCard);
        // updating health
        let health = document.querySelector(".hud > .health");
        let removingHealth = health.getElementsByTagName("li")[0];
        health.removeChild(removingHealth);

        if (playerHealth == 0) {
          // if player health  == 0 say loser card
          let alertCard = document.createElement("div");
          alertCard.className = "alert";
          alertCard.style.position = "absolute";
          alertCard.style.left = "45%";
          alertCard.style.top = "45%";
          alertCard.innerHTML = `<h2> Such A loser<br>You just Survived ${
            bombTotalCount - 3
          } Replay?? 😐😐</h2>`; // just to make an estimation
          alertCard.style.backgroundColor = "white";
          alertCard.style.padding = "20px";
          let replayButton = document.createElement("button");
          replayButton.innerText = "Replay";
          replayButton.className = "replay";
          replayButton.style.padding = "10px";
          replayButton.style.border = "1px";
          replayButton.style.borderColor = "blue";
          replayButton.addEventListener("click", () => {
            location.reload();
          });
          alertCard.appendChild(replayButton);
          document.body.appendChild(alertCard);
        }
      }

      // this is for the bottom portion of ground
      if (bomb.top >= bombBlastTop) {
        if (bomb.top <= bombBlastBottom) {
          currentBomb.className = "explosion";
        }
        if (bomb.top >= bombBlastBottom) {
          currentBomb.remove();
          bombs.splice(whichBomb, 1);
        }
      }
    }
  }
  timer = setInterval(frame, 400 / levels[currentLevel].speed);
  // changes with level
}

document.addEventListener("DOMContentLoaded", kill);
document.addEventListener("DOMContentLoaded", myLoadFunction);
