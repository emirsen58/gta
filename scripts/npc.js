class NPC {
    constructor(x, y, city) {
        this.x = x;
        this.y = y;
        this.city = city;
        this.width = 20;
        this.height = 40;
        this.speed = 1;
        this.direction = Math.random() * 2 * Math.PI;
    }

    update() {
        if (Math.random() < 0.02) {
            this.direction += (Math.random() - 0.5) * Math.PI / 2;
        }

        let newX = this.x + this.speed * Math.cos(this.direction);
        let newY = this.y + this.speed * Math.sin(this.direction);

        if (newX < 0 || newX + this.width > this.city.width) {
            this.direction = Math.PI - this.direction;
        } else {
            this.x = newX;
        }

        if (newY < 0 || newY + this.height > this.city.height) {
            this.direction = -this.direction;
        } else {
            this.y = newY;
        }
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

        // Draw head with eyes and mouth
        ctx.fillStyle = '#ffcc99';
        ctx.beginPath();
        ctx.arc(0, -this.height / 4, this.width / 4, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-this.width / 10, -this.height / 4 - this.height / 20, this.width / 20, 0, Math.PI * 2);
        ctx.arc(this.width / 10, -this.height / 4 - this.height / 20, this.width / 20, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#900';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width / 10, -this.height / 4 + this.height / 20);
        ctx.quadraticCurveTo(0, -this.height / 4 + this.height / 10, this.width / 10, -this.height / 4 + this.height / 20);
        ctx.stroke();

        // Draw body with more shape
        ctx.fillStyle = '#3366cc';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 3, this.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw arms with joints
        ctx.strokeStyle = '#3366cc';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, -this.height / 10);
        ctx.lineTo(-this.width / 2, this.height / 10);
        ctx.lineTo(-this.width / 3, this.height / 3);
        ctx.moveTo(this.width / 3, -this.height / 10);
        ctx.lineTo(this.width / 2, this.height / 10);
        ctx.lineTo(this.width / 3, this.height / 3);
        ctx.stroke();

        // Draw legs with joints
        ctx.beginPath();
        ctx.moveTo(-this.width / 8, this.height / 3);
        ctx.lineTo(-this.width / 8, this.height / 2);
        ctx.lineTo(-this.width / 4, this.height / 1.5);
        ctx.moveTo(this.width / 8, this.height / 3);
        ctx.lineTo(this.width / 8, this.height / 2);
        ctx.lineTo(this.width / 4, this.height / 1.5);
        ctx.stroke();

        ctx.restore();
    }
}

export default NPC;
