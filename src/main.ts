import Game from "./game/Game";
import { $ } from "./util/dom";

const game = new Game();

setTimeout(() => {
	$('loading').classList.remove('visible');
	$('title').classList.add('visible');

	setTimeout(() => game.start(), 1000);
}, 250);
