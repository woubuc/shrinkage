import { START_HEIGHT, WIDTH } from '../../config';
import { range, range_2d, range_all, range_rev } from '../../util/util';
import Point from './Point';
import Tile from './Tile';
import { EventEmitter } from 'eventemitter3';

/**
 * Manages the game grid
 */
export default class Grid extends EventEmitter {

	/** Width of the grid */
	public width : number = WIDTH;

	/** Height of the grid */
	public height : number = START_HEIGHT;

	private tiles : Tile[][];

	/**
	 * Initialises the grid
	 */
	constructor() {
		super();

		// Create tiles
		this.tiles = [];
		range_2d(this.width, this.height, (x, y) => {
			if (!this.tiles[y]) this.tiles[y] = [];
			this.tiles[y][x] = new Tile(this, new Point(x, y));
		});
	}

	/**
	 * Gets the tile at a given coordinate
	 *
	 * @param x  X coordinate
	 * @param y  Y coordinate
	 */
	getTile(x : number, y : number) : Tile {
		if (!this.tiles[y] || !this.tiles[y][x]) {
			throw new RangeError('Invalid tile coordinates: ' + x + 'x' + y);
		}

		return this.tiles[y][x];
	}

	/**
	 * Iterates over all tiles of the grid
	 *
	 * @param callback  Will be called once for each tile
	 */
	forEach(callback : (tile : Tile) => void) {
		range_2d(this.width, this.height, (x, y) => {
			callback(this.getTile(x, y));
		});
	}

	/**
	 * Scans the grid and removes all complete rows
	 *
	 * @returns  The number of rows removed
	 */
	findCompleteRows() {
		let rows : number[] = [];

		range(this.height, (y) => {
			if (range_all(this.width, (x) => this.getTile(x, y).hasBlock)) {
				console.log('YES for row', y);
				rows.push(y);
			}
		});

		if (rows.length === 0) return;

		if (rows.length === 1) {
			this.removeRow(rows[0]);
			this.emit('row');
		} else if (rows.length === 2) {
			this.clearRow(rows[0]);
			this.clearRow(rows[1]);
			this.emit('combo');
		} else {
			this.emit('supercombo', rows.length);
			range(rows.length, (i) => this.clearRow(rows[i]));
			range(rows.length - 2, () => this.addRow());
		}
	}

	/**
	 * Removes all blocks from a row
	 *
	 * @param y  Y-coordinate of the row to clear
	 */
	clearRow(y : number) {
		range(this.width, (x) => {
			this.getTile(x, y).clearBlock();
		});

		range_rev(y, (y) => {
			range(this.width, (x) => {
				const tile = this.getTile(x, y);
				if (tile.hasBlock) tile.moveBlockTo(this.getTile(x, y + 1));
			});
		});
	}

	/**
	 * Removes a row of tiles from the game
	 *
	 * @param y  The Y-coordinate to remove from the grid. If omitted,
	 *           the bottom row will be removed
	 */
	removeRow(y : number = this.height - 1) {
		this.tiles.splice(y, 1);
		this.height--;
		this.emit('height', this.height);

		for (let i = y; i < this.height; i++) {
			range(this.width, (x) => {
				this.getTile(x, i).point.move(0, -1);
			})
		}

	}

	/**
	 * Adds rows to the top of the grid
	 */
	addRow() {
		// Move all existing tiles down to make room for the new rows
		range_2d(this.width, this.height, (x, y) => {
			this.getTile(x, y).point.move(0, 1);
		});

		let row : Tile[] = [];
		range(this.width, (x) => row.push(new Tile(this, new Point(x, 0))));

		this.tiles.unshift(row);
		this.height++;
		this.emit('height', this.height);
	}
}
