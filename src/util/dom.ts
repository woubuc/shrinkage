/**
 * Select an element by its ID
 */
export function $(id : string) : HTMLElement {
	const el = document.getElementById(id);
	if (!el) throw new Error('Could not find element `' + id + '`');
	return el;
}
