const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    hp: 100
};

let enemies = [];
let projectiles = [];
let score = 0;
let gameOver = false;

canvas.addEventListener("click", (e) => {
    if (gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const angle = Math.atan2(my - player.y, mx - player.x);

    projectiles.push({
        x: player.x,
        y: player.y,
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        speed: 7,
        size: 5
    });
});

function spawnEnemy() {
    if (gameOver) return;

    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;

    enemies.push({
        x,
        y,
        size: 15,
        speed: 0.7 + Math.random(),
        hp: 2
    });
}

setInterval(spawnEnemy, 2000);

function update() {
    if (gameOver) return;

    projectiles.forEach((p, i) => {
        p.x += p.dx * p.speed;
        p.y += p.dy * p.speed;
    });

    enemies.forEach((enemy, ei) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        enemy.x += dx / dist * enemy.speed;
        enemy.y += dy / dist * enemy.speed;

        if (dist < player.size + enemy.size) {
            player.hp -= 0.3;
        }

        projectiles.forEach((p, pi) => {
            const dx2 = p.x - enemy.x;
            const dy2 = p.y - enemy.y;
            const d2 = Math.sqrt(dx2*dx2 + dy2*dy2);

            if (d2 < enemy.size) {
                enemy.hp--;
                projectiles.splice(pi, 1);
            }
        });

        if (enemy.hp <= 0) {
            enemies.splice(ei, 1);
            score += 20;
        }
    });

    document.getElementById("hp").innerText = Math.floor(player.hp);
    document.getElementById("score").innerText = score;

    if (player.hp <= 0) {
        gameOver = true;
        alert("Your Nobility Has Fallen.\nFinal Score: " + score);
        location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#d4af37";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "crimson";
    projectiles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = "#a67c00";
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
