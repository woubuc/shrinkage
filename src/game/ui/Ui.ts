import cookies from 'js-cookie';
import Game from '../Game';
import { START_HEIGHT, WIDTH, SQUARE_SIZE } from '../../config';
import { $ } from '../../util/dom';
import { formatScore } from '../../util/format';
import { EventEmitter } from 'eventemitter3';

export default class Ui extends EventEmitter {

	private canvasContainer = $('canvas-container');
	private canvas = <HTMLCanvasElement> $('canvas');

	private paused = $('paused');

	private score = $('score');
	private scoreDisplay : number = 0;
	private scoreTarget : number = 0;

	private game : Game;

	private tutorialStart : boolean = false;
	private tutorial1 : boolean = false;
	private tutorial2 : boolean = false;
	private tutorial3 : boolean = false;

	private score10k : boolean = false
	private score100k : boolean = false;
	private score1m : boolean = false;

	private badgeActive : boolean = false;

	constructor(game : Game) {
		super();

		this.game = game;

		game.on('paused', (p) => this.setPaused(p));
		game.on('score', (s) => this.setScore(s));
		game.on('gameover', () => {
			$('gameover').classList.add('visible');
			$('info').classList.remove('visible');
			$('gameoverinfo').classList.add('visible');
		});

		game.grid.on('height', (h) => this.setHeight(h));
		game.grid.on('width', (w) => this.setWidth(w));

		game.grid.on('row', () => this.row());
		game.grid.on('combo', () => this.combo());
		game.grid.on('supercombo', () => this.superCombo());

		if (cookies.get('tutorial_start')) this.tutorialStart = true;
		if (cookies.get('tutorial_1')) this.tutorial1 = true;
		if (cookies.get('tutorial_2')) this.tutorial2 = true;
		if (cookies.get('tutorial_3')) this.tutorial3 = true;
	}

	init() {
		this.setHeight(START_HEIGHT);
		this.setWidth(WIDTH);

		this.canvasContainer.classList.add('visible');
		$('title').classList.remove('visible');

		if (this.tutorialStart) return;

		this.tutorialStart = true;
		cookies.set('tutorial_start', 'true');
		this.tutorial('start');
	}

	row() {
		if (this.tutorial1 || this.tutorial2 || this.tutorial3) return;

		this.tutorial1 = true;
		cookies.set('tutorial_1', 'true');
		this.tutorial('1');

	}

	combo() {
		this.badge('Combo!');

		if (this.tutorial2 || this.tutorial3) return;

		this.tutorial2 = true;
		cookies.set('tutorial_2', 'true');
		this.tutorial('2');
	}

	superCombo() {
		this.badge('Super combo!');

		if (this.tutorial3) return;

		this.tutorial3 = true;
		cookies.set('tutorial_3', 'true');
		this.tutorial('3');
	}

	tutorial(name : string) {
		this.emit('tutorial', true);
		const t = $('tutorial' + name);
		t.classList.add('visible');

		this.game.input.once('enter', () => {
			t.classList.remove('visible');
			this.emit('tutorial', false);
		});
	}

	setScore(score : number) {
		this.scoreTarget = score;

		if (score >= 10000 && !this.score10k) {
			this.badge('10K points!');
			this.score10k = true;
		}

		if (score >= 100000 && !this.score100k) {
			this.badge('100K points!');
			this.score100k = true;
		}

		if (score >= 1000000 && !this.score1m) {
			this.badge('1M points!');
			this.score1m = true;
		}
	}

	setHeight(height : number) {
		const h = height * SQUARE_SIZE;

		this.canvasContainer.style.height = h + 'px';
		this.canvas.style.height = h + 'px';
		this.canvas.height = h;
	}

	setWidth(width : number) {
		const w = width * SQUARE_SIZE;

		this.canvasContainer.style.width = w + 'px';
		this.canvas.style.width = w + 'px';
		this.canvas.width = w;
	}

	setPaused(paused : boolean) {
		if (paused) this.paused.classList.add('visible');
		else this.paused.classList.remove('visible');
	}

	badge(text : string) {
		console.log(this.badgeActive);
		if (this.badgeActive) {
			setTimeout(() => this.badge(text), 100);
			return;
		}

		this.badgeActive = true;
		setTimeout(() => this.badgeActive = false, 250);

		const badge = document.createElement('div');
		badge.classList.add('badge');
		badge.textContent = text;
		document.body.appendChild(badge);
	}

	update() {
		if (this.scoreDisplay !== this.scoreTarget) {
			const diff = this.scoreTarget - this.scoreDisplay;

			this.scoreDisplay += diff / 5;
			if (Math.abs(diff) < 1) this.scoreDisplay = this.scoreTarget;

			this.score.textContent = formatScore(this.scoreDisplay);
		}
	}
}

