const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let keysPressed = {};

window.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

const viewport = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height
};

import City from './scripts/city.js';
import Player from './scripts/player.js';
import Car from './scripts/car.js';
import NPC from './scripts/npc.js';

const city = new City();
const player = new Player(city);
const cars = [new Car(city, player), new Car(city, player), new Car(city, player)];
cars.forEach(car => {
    car.isPolice = true;
    car.autonomous = false;
});
let npcs = [];

function spawnNPCs() {
    npcs.length = 0;
    for (let i = 0; i < 10; i++) {
        const pos = getRandomSpawnPosition(20, 40);
        npcs.push(new NPC(pos.x, pos.y, city));
    }
}

spawnNPCs();

let score = 0;
let lives = 3;
let gameOver = false;
let gameWon = false;
let damageCooldown = 0;
let saveLifeMessage = '';
let saveLifeMessageTimer = 0;
let gameLoopRunning = false;

function getRandomSpawnPosition(width, height) {
    let x, y, safe;
    do {
        x = Math.random() * (city.width - width);
        y = Math.random() * (city.height - height);
        safe = true;
        for (const building of city.buildings) {
            if (x < building.x + building.width &&
                x + width > building.x &&
                y < building.y + building.height &&
                y + height > building.y) {
                safe = false;
                break;
            }
        }
    } while (!safe);
    return { x, y };
}

const playerPos = getRandomSpawnPosition(player.width, player.height);
player.x = playerPos.x;
player.y = playerPos.y;

const carSpawnZones = [
    { xMin: 0, xMax: city.width / 3, yMin: 0, yMax: city.height / 3 },
    { xMin: city.width / 3, xMax: 2 * city.width / 3, yMin: 0, yMax: city.height / 3 },
    { xMin: 2 * city.width / 3, xMax: city.width, yMin: 0, yMax: city.height / 3 }
];

cars.forEach((car, index) => {
    const zone = carSpawnZones[index % carSpawnZones.length];
    let x, y, safe;
    do {
        x = zone.xMin + Math.random() * (zone.xMax - zone.xMin - car.width);
        y = zone.yMin + Math.random() * (zone.yMax - zone.yMin - car.height);
        safe = true;
        for (const building of city.buildings) {
            if (x < building.x + building.width &&
                x + car.width > building.x &&
                y < building.y + building.height &&
                y + car.height > building.y) {
                safe = false;
                break;
            }
        }
    } while (!safe);
    car.x = x;
    car.y = y;
    car.isDriven = false;
});

function gameLoop() {
    update();
    render();
    if (!gameOver && !gameWon) {
        requestAnimationFrame(gameLoop);
    } else {
        gameLoopRunning = false;
    }
}

function update() {
    if (gameOver || gameWon) {
        return;
    }

    player.update(keysPressed);
    cars.forEach(car => car.update(keysPressed));
    npcs.forEach(npc => npc.update());

    // Check for player-NPC collisions to collect NPCs
    for (let i = npcs.length - 1; i >= 0; i--) {
        const npc = npcs[i];
        const dx = (player.x + player.width / 2) - (npc.x + npc.width / 2);
        const dy = (player.y + player.height / 2) - (npc.y + npc.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionDistance = (player.width + npc.width) / 2;

        if (distance < collisionDistance) {
            npcs.splice(i, 1);
            score++;
            saveLifeMessage = 'You saved one more life!';
            saveLifeMessageTimer = 120; // show message for 2 seconds at 60fps
            if (score >= 10) {
                gameWon = true;
            }
        }
    }

    // Check for collisions with SUVs (police cars)
    if (damageCooldown > 0) {
        damageCooldown--;
    } else {
        for (const car of cars) {
            if (car.isPolice) {
                const dx = (player.x + player.width / 2) - (car.x + car.width / 2);
                const dy = (player.y + player.height / 2) - (car.y + car.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                const collisionDistance = (player.width + car.width) / 2;

                if (distance < collisionDistance) {
                    lives--;
                    damageCooldown = 60; // cooldown frames to avoid rapid life loss
                    if (lives <= 0) {
                        gameOver = true;
                    }
                    break;
                }
            }
        }
    }

    const drivenCar = cars.find(car => car.isDriven);
    if (drivenCar) {
        viewport.x = drivenCar.x + drivenCar.width / 2 - viewport.width / 2;
        viewport.y = drivenCar.y + drivenCar.height / 2 - viewport.height / 2;
    } else {
        viewport.x = player.x + player.width / 2 - viewport.width / 2;
        viewport.y = player.y + player.height / 2 - viewport.height / 2;
    }

    viewport.x = Math.max(0, Math.min(viewport.x, city.width - viewport.width));
    viewport.y = Math.max(0, Math.min(viewport.y, city.height - viewport.height));
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-viewport.x, -viewport.y);

    city.render(ctx);
    player.render(ctx);
    cars.forEach(car => car.render(ctx));
    npcs.forEach(npc => npc.render(ctx));

    ctx.restore();

    // Draw score and lives overlay
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Puan: ${score}`, 20, 30);
    ctx.fillText(`Can: ${lives}`, 20, 60);

    // Draw save life message
    if (saveLifeMessageTimer > 0) {
        ctx.fillStyle = 'yellow';
        ctx.font = '24px Arial';
        ctx.fillText('Bir can daha kurtardın!', canvas.width / 2 - ctx.measureText('Bir can daha kurtardın!').width / 2, 80);
        saveLifeMessageTimer--;
    }

    // Draw win/lose messages
    if (gameWon) {
        ctx.fillStyle = 'lime';
        ctx.font = '40px Arial';
        ctx.fillText('Kazandınız!', canvas.width / 2 - 80, canvas.height / 2);
    } else if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Kaybettiniz!', canvas.width / 2 - 80, canvas.height / 2);
    }
}

function startGame() {
    if (!gameLoopRunning) {
        gameLoopRunning = true;
        document.getElementById('startScreen').style.display = 'none';
        canvas.style.display = 'block';
        gameLoop();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const topRightRestartButton = document.getElementById('topRightRestartButton');

    if (startButton) {
        startButton.addEventListener('click', startGame);
    }

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            // Reset game state
            score = 0;
            lives = 3;
            gameOver = false;
            gameWon = false;
            damageCooldown = 0;

            // Reset player position
            const playerPos = getRandomSpawnPosition(player.width, player.height);
            player.x = playerPos.x;
            player.y = playerPos.y;

            // Reset cars position
            cars.forEach(car => {
                const pos = getRandomSpawnPosition(car.width, car.height);
                car.x = pos.x;
                car.y = pos.y;
                car.isDriven = false;
            });

            // Reset NPCs
            spawnNPCs();

            // Hide restart button and start game immediately
            restartButton.style.display = 'none';
            // topRightRestartButton.style.display = 'none';  // Keep the topRightRestartButton visible
            document.getElementById('startScreen').style.display = 'none';
            canvas.style.display = 'block';
            startGame();
        });
    }

    if (topRightRestartButton) {
        topRightRestartButton.style.display = 'block';
        topRightRestartButton.addEventListener('click', () => {
            // Reset game state
            score = 0;
            lives = 3;
            gameOver = false;
            gameWon = false;
            damageCooldown = 0;

            // Reset player position
            const playerPos = getRandomSpawnPosition(player.width, player.height);
            player.x = playerPos.x;
            player.y = playerPos.y;

            // Reset cars position
            cars.forEach(car => {
                const pos = getRandomSpawnPosition(car.width, car.height);
                car.x = pos.x;
                car.y = pos.y;
                car.isDriven = false;
            });

            // Reset NPCs
            npcs.length = 0;
            for (let i = 0; i < 10; i++) {
                const pos = getRandomSpawnPosition(20, 40);
                npcs.push(new NPC(pos.x, pos.y, city));
            }

            // Hide restart button and start game immediately
            // topRightRestartButton.style.display = 'none';  // Keep the topRightRestartButton visible
            restartButton.style.display = 'none';
            document.getElementById('startScreen').style.display = 'none';
            canvas.style.display = 'block';
            startGame();
        });
    }
});
