import randomIndex from 'random-index';

import { Colour } from '../../util/Colour';
import Block from '../Block';
import Point from '../grid/Point';

export default class ShapeType {

	readonly blocks : [number, number, number, number];
	readonly colour : Colour;
	readonly yOffset : number;

	constructor(blocks : [number, number, number, number], colour : Colour, yOffset : number = 0) {
		this.blocks = blocks;
		this.colour = colour;
		this.yOffset = yOffset;
	}

	/**
	 * Returns the blocks associated with the shape in a given rotation
	 *
	 * @param rot     The rotation index between [0-3]
	 * @param origin  Origin of the shape (top left corner of the 4x4 grid)
	 */
	getShape(rot : number, origin : Point) : Block[] {
		if (!this.blocks[rot]) throw new Error('Invalid shape rotation');

		const blocks = [];

		let col = 0, row = 0;
		for (let b = 0x8000; b > 0; b = b >> 1) {
			if (this.blocks[rot] & b) {
				blocks.push(new Block(this.colour, Point.from(origin, col, row)));
			}

			col++;
			if (col > 3) {
				col = 0;
				row++;
			}
		}

		return blocks;
	}

	/**
	 * Returns a random shape type
	 */
	static random() {
		const index = randomIndex({ max: 12 });

		switch (index) {
			case 1:
			case 2:  return J;
			case 3:
			case 4:  return L;
			case 5:  return O;
			case 6:
			case 7:  return S;
			case 8:
			case 9:  return T;
			case 10:
			case 11: return Z;
			default: return I;
		}
	}
}

export const I = new ShapeType([0x0F00, 0x2222, 0x00F0, 0x4444], Colour.CYAN, -1);
export const J = new ShapeType([0x44C0, 0x8E00, 0x6440, 0x0E20], Colour.BLUE);
export const L = new ShapeType([0x4460, 0x0E80, 0xC440, 0x2E00], Colour.PURPLE);
export const O = new ShapeType([0xCC00, 0xCC00, 0xCC00, 0xCC00], Colour.YELLOW);
export const S = new ShapeType([0x06C0, 0x8C40, 0x6C00, 0x4620], Colour.GREEN, -1);
export const T = new ShapeType([0x0E40, 0x4C40, 0x4E00, 0x4640], Colour.ORANGE, -1);
export const Z = new ShapeType([0x0C60, 0x4C80, 0xC600, 0x2640], Colour.RED, -1);
