import { SQUARE_SIZE } from '../../config';
import Block from '../Block';
import Grid from '../grid/Grid';
import Point from '../grid/Point';
import ShapeType from './ShapeType';
import { EventEmitter } from 'eventemitter3';
import Game from '../Game';
import { Colour } from '../../util/Colour';

export enum Direction {
	Left = -1,
	Right = 1,
}

/**
 * The active shape that is currently being dropped in the game
 */
export default class Shape extends EventEmitter {

	private grid : Grid;

	private blocks : Block[];
	private origin : Point;
	private rotation : number;

	readonly type : ShapeType;

	private gameOver : boolean = false;
	private gameOverStep : number = 0;

	constructor(game : Game, type : ShapeType, origin? : Point) {
		super();

		game.on('gameover', () => this.gameOver = true);

		this.grid = game.grid;
		this.type = type;

		this.blocks = [];

		if (origin) this.origin = origin;
		else this.origin = new Point(Math.floor(this.grid.width / 2) - 1, 0);
		this.origin.move(0, this.type.yOffset);

		this.rotation = 0;
		this.updateBlocks();
		setTimeout(() => {
			for (let block of this.blocks) {
				if (this.grid.getTile(block.point.x, block.point.y).hasBlock) {
					this.emit('collision');
				}
			}
		}, 1);
	}

	/** True if the Shape is currently active */
	get isActive() { return this.blocks.length > 0 }

	private updateBlocks() {
		this.blocks = this.type.getShape(this.rotation, this.origin);
	}

	private stopShape() {
		for (let block of this.blocks) {
			this.grid.getTile(block.point.x, block.point.y).setBlock(block);
		}

		this.blocks = [];
		this.emit('dropped');
	}

	/**
	 * Moves the shape by one grid tile horizontally
	 *
	 * @param direction  Which direction to move
	 * @param amounnt  The amount of blocks
	 *
	 * @returns  True if the move was successful
	 */
	move(direction : Direction, amount : number = 1) : boolean {
		direction = direction * amount;

		// Check if all blocks can move
		for (let block of this.blocks) {
			const newX = block.point.x + direction;
			if (newX < 0 || newX >= this.grid.width) return false;

			const tile = this.grid.getTile(newX, block.point.y);
			if (tile.hasBlock) return false;
		}

		// If we haven't returned yet, we're good to go
		this.origin.move(direction, 0);
		for (let block of this.blocks) {
			block.point.move(direction, 0);
		}

		return true;
	}

	/**
	 * Rotates the shape
	 */
	rotate() {
		// Update rotation
		if (this.rotation >= 3) this.rotation = 0;
		else this.rotation++;

		this.updateBlocks();

		// Make sure that the shape is still inside the grid
		let amount = 0;
		let direction = null;
		for (let block of this.blocks) {
			let localAmount = 0;
			if (block.point.x < 0) {
				direction = Direction.Right;
				localAmount = Math.abs(0 - block.point.x);
			} else if (block.point.x > this.grid.width - 1) {
				direction = Direction.Left;
				localAmount = Math.abs(this.grid.width - 1 - block.point.x);
			}

			if (localAmount > amount) amount = localAmount;
		}

		if (direction != null && amount !== 0) {
			// Shape is not inside the grid
			if (!this.move(direction, amount)) {
				throw new Error('Invalid rotate bounds');
			}
		}

		for (let block of this.blocks) {
			try {
				// Check if this is an empty and valid block
				if (!this.grid.getTile(block.point.x, block.point.y).hasBlock) continue;
			} catch (_) { }

			if (this.rotation === 0) this.rotation = 3;
			else this.rotation--;

			if (direction != null && amount !== 0) {
				if (direction === Direction.Left) this.move(Direction.Right, amount);
				else this.move(Direction.Left, amount);
			}

			this.updateBlocks();
			break;
		}
	}

	/**
	 * Drops the shape down to the next row
	 */
	drop() {
		// Check if we can move
		for (let block of this.blocks) {
			const newY = block.point.y + 1;
			if (newY >= this.grid.height) {
				return this.stopShape();
			}

			const tile = this.grid.getTile(block.point.x, newY);
			if (tile.hasBlock) {
				return this.stopShape();
			}
		}

		// Drop it like it's hot
		this.origin.move(0, 1);
		for (let block of this.blocks) {
			block.point.move(0, 1);
		}

		this.emit('drop');
	}

	draw(ctx : CanvasRenderingContext2D) {
		if (this.gameOver) {
			this.gameOverStep++;
			if (this.gameOverStep < 30) return;
			if (this.gameOverStep > 60) this.gameOverStep = 0;
		}

		let minDistance = this.grid.height;
		for (let block of this.blocks) {
			let i = 1;
			while (block.point.y + i < this.grid.height) {
				if (this.grid.getTile(block.point.x, block.point.y + i).hasBlock) {
					if (minDistance > i - 1) minDistance = i - 1;
				}

				if (block.point.y + i === this.grid.height - 1) {
					if (minDistance > i) minDistance = i;
				}

				i++;
			}

			if (minDistance > i) minDistance = i - 1;
		}

		// console.log('distance', minDistance);

		ctx.save();
		ctx.globalAlpha *= 0.35;
		ctx.fillStyle = Colour.GHOST;

		for (let block of this.blocks) {
			ctx.fillRect(block.point.x * SQUARE_SIZE, (block.point.y + minDistance) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
		}
		ctx.restore();

		for (let block of this.blocks) {
			block.draw(ctx);
		}
		// console.log('Distance to ground: ', minDistance);
	}
}
