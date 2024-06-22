import { ctx } from './GameCanvas';

export class GameAsset {
    image: HTMLImageElement;
    x: number;
    y: number;

    constructor(imageSrc: string, x: number, y: number) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.x = x;
        this.y = y;
    }

    // Draw image of asset on canvas by his position
    draw() {
        ctx.drawImage(this.image, this.x, this.y);
    }

    // Update asset position by new x and y
    updatePosition(newX: number, newY?: number) {
        this.x = newX;
        if (newY !== undefined) {
            this.y = newY;
        }
    }
}
