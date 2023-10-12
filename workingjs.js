var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
let bombs = [];
let bombTotalCount = 0;

const bombBlastTop = 620;
const bombBlastBottom = bombBlastTop + 41;

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
    alien.style.left = left(0, 900 - 100) + "px"; //spaceship moves  itself towards left
    alien.style.top = "15px"; // makes spaceship at the top if the screen

    if (bombs.length <= 10) {
      var bomb = document.createElement("div");
      bomb.id = `bomb-${bombTotalCount}`;
      bombTotalCount++;
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
  }, 600); //animation changes with level
}

function isColidedWithPlayer(leftDist, topDist) {
  if (leftDist < 20 && leftDist >= 0 && topDist < 20 && topDist >= 0) {
    return true;
  }
  return false;
}

function atomBomb() {
  let timer = null;
  let currBombPosition = 1;
  function frame() {
    for (let whichBomb = 0; whichBomb < bombs.length; whichBomb++) {
      let bomb = bombs[whichBomb];
      bomb.top += 40;
      let currentBomb = document.getElementById(bomb.html);
      currentBomb.style.top = bomb.top + "px";

      if (bomb.top >= bombBlastTop) {
        if (bomb.top <= bombBlastBottom) {
          currentBomb.className = "explosion";
          const player = document.getElementById("player");
          const leftPosition = player.offsetLeft;
          const topPosition = player.offsetTop;
          let leftDist = leftPosition - bomb.left;
          let topDist = topPosition - bomb.top;
          leftDist = leftDist < 0 ? leftDist * -1 : leftDist;
          topDist = topDist < 0 ? topDist * -1 : topDist;
          console.log(leftDist, topDist);
          if (isColidedWithPlayer(leftDist, topDist)) {
            alert("player dead 😿😿");
          }
        }
        if (bomb.top >= bombBlastBottom) {
          currentBomb.remove();
          bombs.splice(whichBomb, 1);
        }
        // currentBomb.parentNode.removeChild(currentBomb);
      }
    }
  }
  timer = setInterval(frame, 500);
}

document.addEventListener("DOMContentLoaded", kill);
document.addEventListener("DOMContentLoaded", myLoadFunction);
