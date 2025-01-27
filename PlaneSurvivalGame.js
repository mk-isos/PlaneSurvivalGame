const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const keys = {};
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  color: "blue",
  speed: 5,
};

let enemies = [];
let bullets = [];
let score = 0;
let gameOver = false;
let spawnInterval = 2000; // Initial enemy spawn interval
let lastSpawnTime = 0;

function spawnEnemy() {
  const enemy = {
    x: Math.random() * (canvas.width - 30),
    y: 0,
    width: 30,
    height: 30,
    color: "red",
    speed: 2,
    bulletCooldown: 0,
  };
  enemies.push(enemy);
}

function shootBullet(enemy) {
  bullets.push({
    x: enemy.x + enemy.width / 2 - 5,
    y: enemy.y + enemy.height,
    width: 10,
    height: 10,
    color: "yellow",
    speed: 5,
  });
}

function update() {
  if (gameOver) return;

  // Update player position
  if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
  if (keys.ArrowDown && player.y < canvas.height - player.height)
    player.y += player.speed;
  if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
  if (keys.ArrowRight && player.x < canvas.width - player.width)
    player.x += player.speed;

  // Spawn enemies
  const now = Date.now();
  if (now - lastSpawnTime > spawnInterval) {
    spawnEnemy();
    lastSpawnTime = now;
    spawnInterval = Math.max(500, spawnInterval - 50); // Increase spawn rate over time
  }

  // Update enemies
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;

    // Enemies shoot bullets
    enemy.bulletCooldown--;
    if (enemy.bulletCooldown <= 0) {
      shootBullet(enemy);
      enemy.bulletCooldown = 100;
    }

    // Remove enemy if off-screen
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  // Update bullets
  bullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;

    // Check for collision with player
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      gameOver = true;
    }

    // Remove bullet if off-screen
    if (bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });

  // Update score
  if (!gameOver) {
    score += 1;
  }
}

function draw() {
  // Draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw enemies
  enemies.forEach((enemy) => {
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Draw bullets
  bullets.forEach((bullet) => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Game over text
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText(
      `Your score: ${score}`,
      canvas.width / 2 - 80,
      canvas.height / 2 + 40
    );
  }
}

function loop() {
  update();
  draw();
  if (!gameOver) {
    requestAnimationFrame(loop);
  }
}

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

loop();
