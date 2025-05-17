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
const npcs = [];
for (let i = 0; i < 10; i++) {
    const pos = getRandomSpawnPosition(20, 40);
    npcs.push(new NPC(pos.x, pos.y, city));
}

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

cars.forEach(car => {
    const pos = getRandomSpawnPosition(car.width, car.height);
    car.x = pos.x;
    car.y = pos.y;
    car.isDriven = false;
});

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    player.update(keysPressed);
    cars.forEach(car => car.update(keysPressed));
    npcs.forEach(npc => npc.update());

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
}

function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    canvas.style.display = 'block';
    gameLoop();
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', startGame);
    }
});
