// DEFINE GLOBAL VARIABLES
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const OBSTACLE_VELOCITY = 15;
const NUM_TRACKS = 3;

const player = {
  x: 64,
  y: 0,
  width: 32,
  height: 32,
  trackId: 0,
};

const canvasCorners = {
  topLeft: { x: 0, y: 0 },
  topRight: { x: canvas.width, y: 0 },
  bottomLeft: { x: 0, y: canvas.height },
  bottomRight: { x: canvas.width, y: canvas.height },
};

let tracks = [];
let obstacles = [];
let score = 0;
let highScore = 0;
// DEFINE Create FUNCTIONS

function selectRandomTrack() {
  return Math.floor(Math.random() * NUM_TRACKS);
}

function createTrack() {
  const tracksPadding = canvas.height / 3 / 2;
  return {
    id: tracks.length,
    x: 0,
    y: (canvas.height / NUM_TRACKS) * tracks.length + tracksPadding,
    width: canvas.width,
    height: 32,
  };
}

function createObstacle(obstacle) {
  const tracksPadding = canvas.height / 3 / 2;
  if (obstacle === null) return;
  return {
    id: obstacles.length,
    x: canvas.width,
    y: (canvas.height / NUM_TRACKS) * obstacles.length + tracksPadding,
    width: 64,
    height: 32,
    velocity: OBSTACLE_VELOCITY,
  };
}

// DEFINE Draw FUNCTIONS

function drawText(x, y, text) {
  ctx.font = "30px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, x, y);
}
function drawTrack(track) {
  ctx.fillStyle = "yellow";
  ctx.fillRect(track.x, track.y, track.width, track.height);
}

function drawObstacle(obstacle) {
  if (obstacle === null) return;
  ctx.fillStyle = "red";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// DEFINE Update FUNCTIONS

function updateObstacle(obstacle) {
  if (obstacle === null) return;
  obstacle.x += -obstacle.velocity;
}

function updatePlayer() {
  // get track by id
  console.log(player.trackId);
  const track = tracks[player.trackId];
  // update player y position
  player.y = track.y;

  // check collision with obstacle on track
  const obstacle = obstacles[player.trackId];
  if (
    obstacle !== null &&
    obstacle.x < player.x + player.width &&
    obstacle.x + obstacle.width > player.x
  ) {
    // reset game
    score = 0;
    resetObstacles();
  }
}

// DEFINE Cleanup FUNCTIONS
function checkNewRound() {
  const roundOver = obstacles.some(
    (obstacle) => obstacle !== null && obstacle.x < 0
  );
  // new round means that all obstacles are off the screen
  // and the player has not collided with an obstacle
  if (roundOver) {
    score++;
    if (score > highScore) {
      highScore = score;
    }
    resetObstacles();
  }
}

function resetObstacles() {
  obstacles = [];
  const randInt = Math.floor(Math.random() * NUM_TRACKS);
  for (let i = 0; i < NUM_TRACKS; i++) {
    obstacles.push(createObstacle());
  }
  // set a random track to have no obstacle
  obstacles[randInt] = null;
}

// DEFINE Event HandlersG
function handleKeyDown(event) {
  console.log(event.key);
  switch (event.key) {
    case "ArrowUp":
    case "w":
      if (player.trackId > 0) {
        console.log("up");
        player.trackId -= 1;
      }
      break;
    case "ArrowDown":
    case "s":
      if (player.trackId < NUM_TRACKS - 1) {
        player.trackId++;
      }
      break;
  }
}

document.addEventListener("keydown", handleKeyDown);

// DEFINE Game Loop
// clear canvas
// update player
// for each obstacle, update obstacle
// draw player
// for each track, draw track
// for each obstacle, draw obstacle
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updatePlayer();
  obstacles.forEach(updateObstacle);
  tracks.forEach(drawTrack);
  obstacles.forEach(drawObstacle);
  drawPlayer();
  drawText(50, 50, `Score: ${score}`);
  drawText(canvas.width - 250, 50, `High Score: ${highScore}`);

  checkNewRound();

  requestAnimationFrame(gameLoop);
}

// DEFINE Initialize FUNCTIONS
function init() {
  for (let i = 0; i < NUM_TRACKS; i++) {
    tracks.push(createTrack());
  }
  for (let i = 0; i < NUM_TRACKS; i++) {
    obstacles.push(createObstacle());
  }
  // set a random track to have no obstacle
  const randInt = Math.floor(Math.random() * NUM_TRACKS);
  obstacles[randInt] = null;
}

init();
gameLoop();
