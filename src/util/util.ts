/**
 * Iterates over a range of values from 0 (inclusive) to the given length (exclusive)
 *
 * @param length    Number of values to iterate over
 * @param callback  Will be called for each value
 *
 * @example range(5, (i) => console.log(i)); // 0, 1, 2, 3, 4
 */
export function range(length : number, callback : (i : number) => void) {
	for (let i = 0; i < length; i++) {
		callback(i);
	}
}

/**
 * Iterates over a range of values from the given length (exclusive) down to
 * 0 (inclusive)
 *
 * @param length    Number of values to iterate over
 * @param callback  Will be called for each value
 *
 * @example range(5, (i) => console.log(i)); // 4, 3, 2, 1, 0
 */
export function range_rev(length : number, callback : (i : number) => void) {
	for (let i = length - 1; i >= 0; i--) {
		callback(i);
	}
}

/**
 * Iterates over a 2-dimensional range of values
 *
 * @param length    Number of values to iterate over
 * @param width     Number of values to iterate over for every iteration of `length`
 * @param callback  Will be called for each value
 *
 * @example range(2, 2, (x, y) => console.log(x, y)); // 0 0, 0 1, 1 0, 1 1
 */
export function range_2d(length : number, width : number, callback : (x : number, y : number) => void) {
	range(length, (x) => {
		range(width, (y) => callback(x, y));
	});
}

/**
 * Iterates over a range of values from 0 up to but excluding the given length,
 * and returns as soon as one of the callbacks returns a falsy value
 *
 * @param length    Number of values to iterate over
 * @param callback  Will be called at most once for each value
 *
 * @returns  True if all callbacks returned true, false otherwise
 */
export function range_all(length : number, callback : (i : number) => boolean) : boolean {
	for (let i = 0; i < length; i++) {
		if (!callback(i)) return false;
	}
	return true;
}
