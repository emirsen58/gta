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
        ctx.fillStyle = '#ffcc99';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}

export default NPC;
