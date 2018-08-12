import { SQUARE_SIZE } from '../../config';
import Block from '../Block';
import Grid from './Grid';
import Point from './Point';

/**
 * A tile on the grid
 */
export default class Tile {

	readonly point : Point;

	private map : Grid;
	private _block : Block | null;

	/**
	 * Initialises the tile
	 *
	 * @param grid   Reference to the grid instance managing this tile
	 * @param point  Position of this tile on the grid
	 */
	constructor(grid : Grid, point : Point) {
		this.map = grid;
		this.point = point;
		this._block = null;
	}

	/** The block associated with this tile */
	get block() { return this._block }

	/** Whether this tile has a block associated with it */
	get hasBlock() { return this._block !== null }

	/**
	 * Sets the block on this tile
	 *
	 * @param block  The block to set
	 */
	setBlock(block : Block) {
		this._block = block;
		this._block.setTile(this);
	}

	/**
	 * Removes the block from this tile
	 */
	clearBlock() {
		if (this._block) this._block.clearTile(this);
		this._block = null;
	}

	/**
	 * Moves the block on this tile to another tile
	 * @param dest
	 */
	moveBlockTo(dest : Tile) {
		if (!this.block) throw new Error('Tile has no block to move');
		if (dest.hasBlock) throw new Error('Cannot move block to occupied tile');

		const block = this.block;
		this.clearBlock();
		dest.setBlock(block);
	}

	draw(ctx : CanvasRenderingContext2D) {
		if (this.block) this.block.draw(ctx);

		// ctx.fillStyle = 'white';
		// ctx.fillText(this.point.x + ',' + this.point.y, this.point.x * SQUARE_SIZE, this.point.y * SQUARE_SIZE + 8);
	}
}
