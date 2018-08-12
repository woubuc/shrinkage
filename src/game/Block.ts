import { SQUARE_SIZE } from '../config';
import { Colour } from '../util/Colour';
import Point from './grid/Point';
import Tile from './grid/Tile';

export default class Block {

	readonly colour : Colour;

	private _point : Point | null;
	private _tile : Tile | null;

	constructor(colour : Colour, point : Point | null = null) {
		this._point = point;
		this._tile = null;
		this.colour = colour;
	}

	get point() {
		if (this.tile) return this.tile.point;
		if (!this._point) throw new Error('Block lost');
		return this._point;
	}

	get tile() {
		return this._tile;
	}

	setTile(tile : Tile) {
		this._tile = tile;
	}

	clearTile(tile : Tile) {
		if (this._tile === tile) this._tile = null;
	}

	draw(ctx : CanvasRenderingContext2D, size : number = SQUARE_SIZE) {
		ctx.fillStyle = this.colour;
		ctx.fillRect(this.point.x * size, this.point.y * size, size, size);
	}
}
