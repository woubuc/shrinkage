import EventEmitter from 'eventemitter3';
import keycode from 'keycode';

const KEYS_WATCH = ['down', 'left', 'right'];
const KEYS_SINGLE = ['up', 'esc', 'space', 'enter'];

/**
 * Handles keyboard input
 */
export default class Input extends EventEmitter {

	private inputs : Map<string, number> = new Map();

	/**
	 * Initialises the input manager
	 */
	constructor() {
		super();

		window.addEventListener('keydown', (e) => this.onKeyDown(e));
		window.addEventListener('keyup', (e) => this.onKeyUp(e))
	}

	// Event handler
	private onKeyDown(e : KeyboardEvent) {
		if (e.repeat) return;

		const key = keycode(e);

		if (KEYS_WATCH.includes(key)) this.startWatcher(key);
		else if (KEYS_SINGLE.includes(key)) this.emit(key);
	}

	// Event handler
	private onKeyUp(e : KeyboardEvent) {
		this.stopWatcher(keycode(e));
	}

	/**
	 * Starts a watcher that repeatedly emits the event until stopped
	 *
	 * @param event  Name of the event
	 */
	private startWatcher(event : string) {
		this.emit(event);
		this.inputs.set(event, setInterval(() => this.emit(event), 110));
	}

	/**
	 * Stops a watcher
	 *
	 * @param event  Name of the event
	 */
	private stopWatcher(event : string) {
		if (!this.inputs.has(event)) return;
		clearInterval(this.inputs.get(event));
	}

	/**
	 * Stops all repeated input events until associated keys are pressed again
	 */
	public clear() {
		KEYS_WATCH.forEach((key) => this.stopWatcher(key));
	}
}
