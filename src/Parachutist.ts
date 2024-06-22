import { GameAsset } from './GameAsset';

export class Parachutist extends GameAsset {
    velocity: number = 2; // Speed of falling

    // Update parachutist falling position
    fall() {
        this.updatePosition(this.x, this.y + this.velocity);
    }
}