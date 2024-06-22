import { GameAsset } from './GameAsset';
import { canvas } from './GameCanvas';

export class Plane extends GameAsset {
    velocity: number = -5; // Negative for leftward movement

    // Moving the plane consistently right to left
    move() {
        this.updatePosition(this.x + this.velocity);
        if (this.x + this.image.width < 0) { // Reset position to the right when it goes off screen
            this.x = canvas.width;
        }
    }
}