class City {
    constructor() {
        this.width = 1600;
        this.height = 1200;
        this.roads = [
            { x: 0, y: 500, width: 1600, height: 200 },
            { x: 700, y: 0, width: 200, height: 1200 },
            { x: 0, y: 900, width: 1600, height: 100 },
            { x: 1200, y: 0, width: 100, height: 1200 }
        ];
        this.buildings = [
            { x: 50, y: 300, width: 150, height: 200, color: '#555' },
            { x: 250, y: 300, width: 200, height: 150, color: '#666' },
            { x: 600, y: 700, width: 300, height: 200, color: '#777' },
            { x: 1000, y: 1100, width: 400, height: 150, color: '#888' },
            { x: 1300, y: 500, width: 200, height: 300, color: '#999' }
        ];
        this.trees = [
            { x: 100, y: 450, radius: 20 },
            { x: 400, y: 600, radius: 25 },
            { x: 1200, y: 800, radius: 22 },
            { x: 1400, y: 400, radius: 18 }
        ];
    }

    render(ctx) {
        ctx.fillStyle = '#3a9d23';
        ctx.fillRect(0, 0, this.width, 300);
        ctx.fillRect(0, 800, this.width, 400);
        ctx.fillRect(0, 0, 600, this.height);
        ctx.fillRect(1000, 0, 600, this.height);

        this.roads.forEach(road => {
            ctx.fillStyle = '#555';
            ctx.fillRect(road.x, road.y, road.width, road.height);

            ctx.fillStyle = '#777';
            ctx.fillRect(road.x, road.y, road.width, 5);
            ctx.fillRect(road.x, road.y + road.height - 5, road.width, 5);
            ctx.fillRect(road.x, road.y, 5, road.height);
            ctx.fillRect(road.x + road.width - 5, road.y, 5, road.height);

            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.setLineDash([20, 15]);
            ctx.beginPath();
            if (road.width > road.height) {
                let y = road.y + road.height / 2;
                ctx.moveTo(road.x, y);
                ctx.lineTo(road.x + road.width, y);
            } else {
                let x = road.x + road.width / 2;
                ctx.moveTo(x, road.y);
                ctx.lineTo(x, road.y + road.height);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            if (road.width > 150 || road.height > 150) {
                ctx.strokeStyle = '#ff0';
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (road.width > road.height) {
                    let y = road.y + road.height / 4;
                    ctx.moveTo(road.x, y);
                    ctx.lineTo(road.x + road.width, y);
                    y = road.y + (3 * road.height) / 4;
                    ctx.moveTo(road.x, y);
                    ctx.lineTo(road.x + road.width, y);
                } else {
                    let x = road.x + road.width / 4;
                    ctx.moveTo(x, road.y);
                    ctx.lineTo(x, road.y + road.height);
                    x = road.x + (3 * road.width) / 4;
                    ctx.moveTo(x, road.y);
                    ctx.lineTo(x, road.y + road.height);
                }
                ctx.stroke();
            }
        });

        this.buildings.forEach(building => {
            const gradient = ctx.createLinearGradient(building.x, building.y, building.x, building.y + building.height);
            gradient.addColorStop(0, '#aaa');
            gradient.addColorStop(1, building.color);
            ctx.fillStyle = gradient;
            ctx.fillRect(building.x, building.y, building.width, building.height);

            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.moveTo(building.x, building.y);
            ctx.lineTo(building.x + building.width / 2, building.y - building.height / 4);
            ctx.lineTo(building.x + building.width, building.y);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ddd';
            for (let i = building.x + 10; i < building.x + building.width - 10; i += 20) {
                for (let j = building.y + 20; j < building.y + building.height - 20; j += 30) {
                    ctx.fillRect(i, j, 12, 20);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fillRect(i + 2, j + 2, 8, 6);
                    ctx.fillStyle = '#ddd';
                }
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(building.x + building.width, building.y);
            ctx.lineTo(building.x + building.width + building.width / 6, building.y - building.height / 4);
            ctx.lineTo(building.x + building.width + building.width / 6, building.y + building.height - building.height / 4);
            ctx.lineTo(building.x + building.width, building.y + building.height);
            ctx.closePath();
            ctx.fill();
        });

        this.trees.forEach(tree => {
            ctx.fillStyle = '#654321';
            ctx.fillRect(tree.x - 5, tree.y, 10, 20);

            const gradient = ctx.createRadialGradient(tree.x, tree.y, tree.radius / 2, tree.x, tree.y, tree.radius);
            gradient.addColorStop(0, '#228B22');
            gradient.addColorStop(1, '#006400');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(tree.x, tree.y, tree.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

export default City;
