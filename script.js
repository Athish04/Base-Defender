// Game variables
let score = 0;
let baseHealth = 100;
let turretHealth = 100;
let gameOver = false;

// Canvas variables
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

// Base variables
const base = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 40,
  width: 60,
  height: 40,
  color: '#2ecc71'
};

// Turret variables
const turret = {
  x: canvas.width / 2 - 10,
  y: 10,
  width: 20,
  height: 20,
  color: '#3498db'
};

// Robot variables
const robots = [];
const robotSpeed = 0.2; 
const robotFireInterval = 5000; 

// Projectile variables
const turretProjectiles = [];
const robotProjectiles = [];
let projectileSpeed = 1.2; 

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Key states
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

function handleKeyDown(event) {
  if (event.key in keys) {
    event.preventDefault();
    keys[event.key] = true;

    
    if (keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight) {
      clearInterval(turretProjectileTimer);
      turretProjectileTimer = setInterval(fireTurretProjectile, 1000); 
      projectileSpeed = 2; 
    }
  }
}


function handleKeyUp(event) {
  if (event.key in keys) {
    event.preventDefault();
    keys[event.key] = false;

   
    if (!keys.ArrowUp && !keys.ArrowDown && !keys.ArrowLeft && !keys.ArrowRight) {
      clearInterval(turretProjectileTimer);
      turretProjectileTimer = setInterval(fireTurretProjectile, 750); 
      projectileSpeed = 5; 
    }
  }
}


function moveTurret() {
  if (keys.ArrowUp && turret.y > 0) {
    turret.y -= 2;
  }
  if (keys.ArrowDown && turret.y < canvas.height - turret.height) {
    turret.y += 2;
  }
  if (keys.ArrowLeft && turret.x > 0) {
    turret.x -= 2;
  }
  if (keys.ArrowRight && turret.x < canvas.width - turret.width) {
    turret.x += 2;
  }
}


function createRobot() {
  const robot = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    width: 20,
    height: 20,
    color: '#f39c12',
    dy: robotSpeed,
    fireTimer: null
  };

  robot.fireTimer = setTimeout(() => {
    if (!gameOver) {
      fireRobotProjectile(robot);
    }
  }, Math.random() * (robotFireInterval - 1000) + 1000); // Randomize the firing time

  robots.push(robot);
}


// Move a robot
function moveRobot(robot) {
  robot.y += robot.dy;
}

// Fire a projectile from the turret
function fireTurretProjectile() {
  const projectile = {
    x: turret.x + turret.width / 2 - 2.5,
    y: turret.y,
    width: 5,
    height: 10,
    color: '#e74c3c',
    dy: -projectileSpeed
  };
  turretProjectiles.push(projectile);
}

// Fire a projectile from a robot
function fireRobotProjectile(robot) {
  const projectile = {
    x: robot.x + robot.width / 2 - 2.5,
    y: robot.y + robot.height,
    width: 5,
    height: 10,
    color: '#f1c40f',
    dy: projectileSpeed
  };
  robotProjectiles.push(projectile);
}

// Move a projectile
function moveProjectile(projectile) {
  projectile.y += projectile.dy;
}

// Check collision between two objects
function checkCollision(object1, object2) {
  return (
    object1.x < object2.x + object2.width &&
    object1.x + object1.width > object2.x &&
    object1.y < object2.y + object2.height &&
    object1.y + object1.height > object2.y
  );
}

// Update the score
function updateScore() {
  score++;
}

// Update the health of the base
function updateBaseHealth() {
  baseHealth -= 10; // Reduce base health by 10 (change as needed)

  if(baseHealth <= 0){
    baseHealth = 0;
    gameOver = true;
  }
}

// Update the health of the turret
function updateTurretHealth() {
  turretHealth -= 10; // Reduce turret health by 10 (change as needed)
  
  if(turretHealth <= 0){
    turretHealth = 0;
    gameOver = true;
  }
}

// Draw the base
function drawBase() {
  context.fillStyle = base.color;
  context.fillRect(base.x, base.y, base.width, base.height);
}

// Draw the turret
function drawTurret() {
  context.fillStyle = turret.color;
  context.fillRect(turret.x, turret.y, turret.width, turret.height);
}

// Draw a robot
function drawRobot(robot) {
  context.fillStyle = robot.color;
  context.fillRect(robot.x, robot.y, robot.width, robot.height);
}

// Draw a projectile
function drawProjectile(projectile) {
  context.fillStyle = projectile.color;
  context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
}

// Draw the score
function drawScore() {
  context.fillStyle = '#000000';
  context.fillText('Score: ' + score, 10, 20);
}

function drawHealth() {
  // Turret health
  context.fillStyle = '#e74c3c';
  context.fillRect(canvas.width - 120, 10, turretHealth, 10);
  
  // Base health
  context.fillStyle = '#e74c3c';
  context.fillRect(canvas.width - 120, 25, baseHealth, 10);
  
  // Turret health label
  context.fillStyle = '#000000';
  context.fillText('Turret Health:', canvas.width - 240, 20);
  
  // Base health label
  context.fillStyle = '#000000';
  context.fillText('Base Health:', canvas.width - 240, 35);
}

// Update the game
function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawBase();
  drawTurret();
  drawScore();
  drawHealth();

  moveTurret();

  if(!gameOver){
  // Create robots
  if (Math.random() < 0.01) {
    createRobot();
  }

  if (turret.y == 20) {
    fireTurretProjectile();
  }
}

  // Move and draw robots
  robots.forEach((robot, index) => {
    moveRobot(robot);
    drawRobot(robot);

    // Check collision between robot and base
    if (!gameOver && checkCollision(robot, base)) {
      robots.splice(index, 1);
      updateBaseHealth();
    }

    // Check collision between robot and turret projectiles
    turretProjectiles.forEach((projectile, projectileIndex) => {
      if (checkCollision(robot, projectile)) {
        robots.splice(index, 1);
        turretProjectiles.splice(projectileIndex, 1);
        updateScore();
      }
    });
  });

  // Move and draw turret projectiles
  turretProjectiles.forEach((projectile, index) => {
    moveProjectile(projectile);
    drawProjectile(projectile);

    // Remove projectile if it goes offscreen
    if (projectile.y < 0) {
      turretProjectiles.splice(index, 1);
    }
  });

  // Move and draw robot projectiles
  robotProjectiles.forEach((projectile, index) => {
    if(!gameOver){
    moveProjectile(projectile);
    }
    drawProjectile(projectile);

    // Check collision between robot projectile and base
    if (!gameOver && checkCollision(projectile, base)) {
      robotProjectiles.splice(index, 1);
      updateBaseHealth();
    }

    // Check collision between robot projectile and turret
    if (!gameOver && checkCollision(projectile, turret)) {
      robotProjectiles.splice(index, 1);
      updateTurretHealth();
    }

    // Remove projectile if it goes offscreen
    if (projectile.y > canvas.height) {
      robotProjectiles.splice(index, 1);
    }
  });

  if (gameOver) {
    clearInterval(robotTimer);
    clearInterval(turretProjectileTimer);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    robotProjectiles.length = 0;
    const playAgain = confirm('Game over! Do you want to play again?');
    if (playAgain) {
      resetGame();
      return; // Exit the update loop
    }
  }

  requestAnimationFrame(update);
}

function resetGame() {
  score = 0;
  baseHealth = 100;
  turretHealth = 100;
  robots.length = 0;
  turretProjectiles.length = 0;
  robotProjectiles.length = 0;
  gameOver = false;
  turret.x = base.x + base.width / 2 - turret.width / 2;
  turret.y = base.y - turret.height;
  clearInterval(robotTimer);
  clearInterval(turretProjectileTimer);
  document.removeEventListener('keydown', handleKeyDown); // Remove event listener
  document.removeEventListener('keyup', handleKeyUp); // Remove event listener
  robotTimer = setInterval(createRobot, 2000);
  turretProjectileTimer = setInterval(fireTurretProjectile, 500);
  document.addEventListener('keydown', handleKeyDown); // Add event listener again
  document.addEventListener('keyup', handleKeyUp); // Add event listener again
  fireTurretProjectile();
  update();
}


// Start the game
let turretProjectileTimer;
let robotTimer = setInterval(createRobot, 2000); 
turretProjectileTimer = setInterval(fireTurretProjectile, 500);
update();
