class Car {
    constructor(city, player) {
        this.city = city;
        this.player = player;
        this.x = 400;
        this.y = 300;
        this.width = 60;
        this.height = 30;
        this.speed = 0;
        this.maxSpeed = 3;
        this.acceleration = 0.1;
        this.friction = 0.05;
        this.angle = 0;
        this.turnSpeed = 2;
        this.isDriven = false;
        this.autonomous = true;
        this.directionChangeCooldown = 0;
        this.isPolice = false;
    }

    update(keys) {
        if (this.isDriven) {
            this.controlledUpdate(keys);
        } else if (this.isPolice) {
            this.policeChaseUpdate();
        } else if (this.autonomous) {
            this.autonomousUpdate();
        }
    }

    policeChaseUpdate() {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;

        let angleDiff = targetAngle - this.angle;
        angleDiff = ((angleDiff + 180) % 360) - 180;

        if (angleDiff > 0) {
            this.angle += Math.min(angleDiff, this.turnSpeed);
        } else {
            this.angle += Math.max(angleDiff, -this.turnSpeed);
        }

        if (this.speed < this.maxSpeed) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        }

        let newX = this.x + this.speed * Math.cos(this.angle * Math.PI / 180);
        let newY = this.y + this.speed * Math.sin(this.angle * Math.PI / 180);

        if (!this.collidesWithBuildings(newX, newY)) {
            this.x = newX;
            this.y = newY;
        } else {
            this.speed = 0;
            this.angle += 90 + Math.random() * 90;
        }

        this.x = Math.max(0, Math.min(this.x, this.city.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.city.height - this.height));
    }

    controlledUpdate(keys) {
        let newX = this.x + this.speed * Math.cos(this.angle * Math.PI / 180);
        let newY = this.y + this.speed * Math.sin(this.angle * Math.PI / 180);

        if (keys['ArrowUp'] || keys['w']) {
            this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
        } else if (keys['ArrowDown'] || keys['s']) {
            this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed / 2);
        } else {
            if (this.speed > 0) {
                this.speed = Math.max(this.speed - this.friction, 0);
            } else if (this.speed < 0) {
                this.speed = Math.min(this.speed + this.friction, 0);
            }
        }

        if (keys['ArrowLeft'] || keys['a']) {
            this.angle -= this.turnSpeed * (this.speed / this.maxSpeed);
        }
        if (keys['ArrowRight'] || keys['d']) {
            this.angle += this.turnSpeed * (this.speed / this.maxSpeed);
        }

        if (!this.collidesWithBuildings(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }

        this.x = Math.max(0, Math.min(this.x, this.city.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.city.height - this.height));
    }

    autonomousUpdate() {
        if (this.directionChangeCooldown > 0) {
            this.directionChangeCooldown--;
        } else {
            this.angle += (Math.random() - 0.5) * 30;
            this.speed = this.maxSpeed * (0.5 + Math.random() * 0.5);
            this.directionChangeCooldown = 100 + Math.floor(Math.random() * 100);
        }

        let newX = this.x + this.speed * Math.cos(this.angle * Math.PI / 180);
        let newY = this.y + this.speed * Math.sin(this.angle * Math.PI / 180);

        if (!this.collidesWithBuildings(newX, newY)) {
            this.x = newX;
            this.y = newY;
        } else {
            this.angle += 180;
            this.speed = 0;
            this.directionChangeCooldown = 50;
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
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle * Math.PI / 180);

        // SUV style body (Jeep/Mercedes G-Class)
        const bodyGradient = ctx.createLinearGradient(-this.width / 2, -this.height / 2, this.width / 2, this.height / 2);
        bodyGradient.addColorStop(0, '#660000'); // dark red
        bodyGradient.addColorStop(1, '#cc0000'); // bright red
        ctx.fillStyle = bodyGradient;

        // Boxy shape with roof rack
        ctx.beginPath();
        ctx.moveTo(-this.width / 2, this.height / 4);
        ctx.lineTo(-this.width / 2, -this.height / 3);
        ctx.lineTo(-this.width / 4, -this.height / 2);
        ctx.lineTo(this.width / 4, -this.height / 2);
        ctx.lineTo(this.width / 2, -this.height / 3);
        ctx.lineTo(this.width / 2, this.height / 4);
        ctx.closePath();
        ctx.fill();

        // Roof rack
        ctx.fillStyle = '#330000';
        ctx.fillRect(-this.width / 3, -this.height / 2 - 5, this.width / 1.5, 5);

        // Windows
        const windowGradient = ctx.createLinearGradient(-this.width / 4, -this.height / 2, this.width / 4, -this.height / 6);
        windowGradient.addColorStop(0, '#ff9999');
        windowGradient.addColorStop(1, '#ffcccc');
        ctx.fillStyle = windowGradient;
        ctx.fillRect(-this.width / 4, -this.height / 2, this.width / 2, this.height / 3);

        // Wheels
        ctx.fillStyle = '#111';
        const wheelRadius = this.height / 4;
        ctx.beginPath();
        ctx.arc(-this.width / 3, this.height / 3, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(-this.width / 3, this.height / 3, wheelRadius / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(this.width / 3, this.height / 3, wheelRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(this.width / 3, this.height / 3, wheelRadius / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
}

export default Car;
