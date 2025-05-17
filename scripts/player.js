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

            const bodyGradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
            bodyGradient.addColorStop(0, '#003399');
            bodyGradient.addColorStop(1, '#66a3ff');
            ctx.fillStyle = bodyGradient;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            const windowGradient = ctx.createLinearGradient(-this.width / 4, -this.height / 2, this.width / 4, -this.height / 6);
            windowGradient.addColorStop(0, '#99ccff');
            windowGradient.addColorStop(1, '#cce6ff');
            ctx.fillStyle = windowGradient;
            ctx.fillRect(-this.width / 4, -this.height / 2, this.width / 2, this.height / 3);

            ctx.fillStyle = '#111';
            const wheelRadius = this.height / 4;
            ctx.beginPath();
            ctx.arc(-this.width / 3, this.height / 2 - wheelRadius, wheelRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(-this.width / 3, this.height / 2 - wheelRadius, wheelRadius / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.arc(this.width / 3, this.height / 2 - wheelRadius, wheelRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(this.width / 3, this.height / 2 - wheelRadius, wheelRadius / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }
}

export default Player;
