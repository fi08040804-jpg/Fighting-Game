const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x:100,
    y:300,
    width:60,
    height:120,
    color:'red',
    combo:0,
    health:100
};

let enemy = {
    x:600,
    y:300,
    width:60,
    height:120,
    color:'blue',
    health:100,
    state:"idle"
};

// 🎮 PLAYER CONTROL
document.addEventListener('keydown', (e) => {

    if (e.key === 'ArrowRight') player.x += 20;
    if (e.key === 'ArrowLeft') player.x -= 20;

    if (e.key === ' ') {
        player.combo++;

        if (Math.abs(player.x - enemy.x) < 80) {
            enemy.health -= 5;
        }

        if (player.combo >= 3) {
            console.log("🔥 COMBO!");
            enemy.health -= 10;
            player.combo = 0;
        }
    }
});

// 🤖 AI LOGIC
function enemyAI() {

    let distance = player.x - enemy.x;

    // Move towards player
    if (Math.abs(distance) > 70) {
        if (distance > 0) enemy.x += 2;
        else enemy.x -= 2;
    }

    // Attack if close
    if (Math.abs(distance) < 80) {
        if (Math.random() < 0.02) {
            player.health -= 5;
            console.log("Enemy attack!");
        }
    }

    // Dodge (random jump style movement)
    if (Math.random() < 0.01) {
        enemy.x += (Math.random() > 0.5 ? 50 : -50);
    }
}

// 🎨 DRAW
function drawPlayer(p) {
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
}

function drawHealthBar(x, y, health, color) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, 200, 20);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, health * 2, 20);
}

// 🔁 GAME LOOP
function gameLoop() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    enemyAI();

    drawPlayer(player);
    drawPlayer(enemy);

    drawHealthBar(20,20,player.health,'green');
    drawHealthBar(canvas.width - 220,20,enemy.health,'red');

    // Game Over
    if (player.health <= 0) {
        alert("😢 You Lose!");
        location.reload();
    }

    if (enemy.health <= 0) {
        alert("🏆 You Win!");
        location.reload();
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();