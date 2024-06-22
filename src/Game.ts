import { canvas, ctx } from './GameCanvas';
import { GameAsset } from './GameAsset';
import { Parachutist } from './Parachutist';
import { Plane } from './Plane';

export class Game {
    assets: GameAsset[] = [];
    parachutists: Parachutist[] = [];
    boat!: GameAsset;
    plane!: Plane;
    score: number = 0;
    lives: number = 3;

    constructor() {
        this.loadAssets();
        this.attachMouseListeners();
        setInterval(() => this.spawnParachutist(), 2000); // Try to spawn a parachutist every 2 seconds
        setInterval(() => this.dropParachutist(), 1000 + Math.random() * 3000); // Random drops
    }

    // Load images and start the game
    loadAssets() {
        const background = new GameAsset('Images/background.png', 0, 0);
        const sea = new GameAsset('Images/sea.png', 0, canvas.height - 150);
        this.boat = new GameAsset('Images/boat.png', canvas.width / 2 - 50, canvas.height - 150);
        this.plane = new Plane('Images/plane.png', canvas.width - 100, 20);
        
        this.assets.push(background, sea, this.boat);
        this.assets.push(this.plane);

        window.onload = () => this.start();
    }

    start() {
        this.gameLoop();
    }

    gameLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.assets.forEach(asset => asset.draw());
        this.updateParachutists();
        this.plane.move();
        this.drawScoreAndLives();
        requestAnimationFrame(this.gameLoop);
    }

    // Add mouse event listner.
    attachMouseListeners() {
        canvas.addEventListener('mousemove', this.handleMouseMove);
    }

    // Handle mouse evenets
    handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const newX = (event.clientX - rect.left) * scaleX - this.boat.image.width / 2;
        this.boat.updatePosition(newX, this.boat.y);
    }

    // Random position for parachutist to fall
    dropParachutist() {
        if (Math.random() > 0.7) { // Random chance to drop
            this.spawnParachutist();
        }
    }

    spawnParachutist() {
        const xPosition = this.plane.x + this.plane.image.width / 2; // Drop from the center of the plane
        const parachutist = new Parachutist('Images/parachutist.png', xPosition, this.plane.y + this.plane.image.height);
        this.parachutists.push(parachutist);
    }

    // Update parachutists positions and check if there is collision between the boat or the sea
    // and add score if the boat catches a parachutist else lose life point
    updateParachutists() {
        this.parachutists.forEach(parachutist => {
            parachutist.fall();
            if (this.checkCollision(parachutist, this.boat)) {
                this.score += 10; // Add score if the boat catches a parachutist
                this.parachutists.splice(this.parachutists.indexOf(parachutist), 1); // Remove the caught parachutist
            } else if (parachutist.y > canvas.height - 150) {
                this.parachutists.splice(this.parachutists.indexOf(parachutist), 1);
                this.lives -= 1; // Lose a life point if the parachutist hits the water
                if (this.lives === 0) this.endGame();
            }
            parachutist.draw(); // Ensure parachutists are drawn in their updated positions
        });
    }

    // Checks if the parachutist touch the boat and returns true or false
    checkCollision(parachutist: Parachutist, boat: GameAsset): boolean {
        const boatRight = boat.x + boat.image.width;
        const boatBottom = boat.y + boat.image.height;
        const parachutistRight = parachutist.x + parachutist.image.width;
        const parachutistBottom = parachutist.y + parachutist.image.height;

        return !(boat.x > parachutistRight ||
                 boatRight < parachutist.x ||
                 boat.y > parachutistBottom ||
                 boatBottom < parachutist.y);
    }

    // Shows the score and live points the player has.
    drawScoreAndLives() {
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(`Score: ${this.score}`, 10, 20);
        ctx.fillText(`Lives: ${this.lives}`, 10, 40);
    }

    // End game by alert and reload page to restart the game.
    endGame() {
        alert("Game Over!");
        window.location.reload();
    }
}