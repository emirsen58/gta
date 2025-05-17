class Player {
    constructor(city) {
        this.city = city;
        this.x = 100;
        this.y = 300;
        this.width = 30;
        this.height = 50;
        this.speed = 3;
        this.inCar = false;
    }

    update(keys) {
        if (this.inCar) return;

        let newX = this.x;
        let newY = this.y;

        if (keys['ArrowUp'] || keys['w']) {
            newY -= this.speed;
        }
        if (keys['ArrowDown'] || keys['s']) {
            newY += this.speed;
        }
        if (keys['ArrowLeft'] || keys['a']) {
            newX -= this.speed;
        }
        if (keys['ArrowRight'] || keys['d']) {
            newX += this.speed;
        }

        if (!this.collidesWithBuildings(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }

        this.x = Math.max(0, Math.min(this.x, this.city.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.city.height - this.height));
    }

    collidesWithBuildings(x, y) {
        for (const building of this.city.buildings) {
            if (x < building.x + building.width &&
                x + this.width > building.x &&
                y < building.y + building.height &&
                y + this.height > building.y) {
                return true;
            }
        }
        return false;
    }

    render(ctx) {
        if (!this.inCar) {
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

            // Ferrari-style sports car body
            const bodyGradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
            bodyGradient.addColorStop(0, '#b30000'); // dark red
            bodyGradient.addColorStop(1, '#ff0000'); // bright red
            ctx.fillStyle = bodyGradient;

            // Sleek, low profile shape
            ctx.beginPath();
            ctx.moveTo(-this.width / 2, this.height / 4);
            ctx.lineTo(-this.width / 3, -this.height / 2);
            ctx.lineTo(this.width / 3, -this.height / 2);
            ctx.lineTo(this.width / 2, this.height / 4);
            ctx.closePath();
            ctx.fill();

            // Hood vents
            ctx.fillStyle = '#660000';
            ctx.fillRect(-this.width / 6, -this.height / 2 + 5, this.width / 12, this.height / 6);
            ctx.fillRect(this.width / 24, -this.height / 2 + 5, this.width / 12, this.height / 6);

            // Windows
            const windowGradient = ctx.createLinearGradient(-this.width / 4, -this.height / 2, this.width / 4, -this.height / 6);
            windowGradient.addColorStop(0, '#99ccff');
            windowGradient.addColorStop(1, '#cce6ff');
            ctx.fillStyle = windowGradient;
            ctx.fillRect(-this.width / 4, -this.height / 2, this.width / 2, this.height / 3);

            // Wheels
            ctx.fillStyle = '#111';
            const wheelRadius = this.height / 5;
            ctx.beginPath();
            ctx.ellipse(-this.width / 3, this.height / 3, wheelRadius, wheelRadius / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.ellipse(-this.width / 3, this.height / 3, wheelRadius / 2, wheelRadius / 4, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(this.width / 3, this.height / 3, wheelRadius, wheelRadius / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.ellipse(this.width / 3, this.height / 3, wheelRadius / 2, wheelRadius / 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Spoiler
            ctx.fillStyle = '#800000';
            ctx.fillRect(-this.width / 4, this.height / 4, this.width / 2, this.height / 20);

            ctx.restore();
        }
    }
}

export default Player;
