/** A 2-dimensional point on a grid */
export default class Point {

	private _x : number;
	private _y : number;

	/**
	 * Creates a new point from an existing point
	 *
	 * @param point  The point to use as starting point
	 * @param addX   Value to add to the X coordinate
	 * @param addY   Value to add to the Y coordinate
	 */
	static from(point : Point, addX : number = 0, addY : number = 0) {
		return new Point(point.x + addX, point.y + addY);
	}

	/**
	 * Creates a new Point
	 *
	 * @param x  The X coordinate
	 * @param y  The Y coordinate
	 */
	constructor(x : number, y : number) {
		this._x = x;
		this._y = y;
	}

	/** The X coordinate */
	get x() { return this._x }

	/** The Y coordinate */
	get y() { return this._y }

	/**
	 * Moves the point by the given steps
	 *
	 * @param x  Steps to move the X coordinate
	 * @param y  Steps to move the Y coordinate
	 */
	move(x : number, y : number) {
		this._x += x;
		this._y += y;
	}

	/**
	 * Checks if this point has the same coordinates as another point
	 *
	 * @param point  The point to compare
	 *
	 * @returns  True if the points have the same coordinates
	 */
	equals(point : Point) : boolean {
		return this.x === point.x && this.y === point.y;
	}
}
