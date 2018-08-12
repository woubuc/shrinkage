import { SQUARE_SIZE, TICKS_PER_SEC } from '../config';
import Grid from './grid/Grid';
import Input from './Input';
import Shape from './shape/Shape';
import ShapeType from './shape/ShapeType';
import Ui from './ui/Ui';
import { EventEmitter } from 'eventemitter3';
import { $ } from '../util/dom';
import Point from './grid/Point';
import { Colour } from '../util/Colour';

export default class Game extends EventEmitter {

	public score : number = 0;

	readonly grid : Grid;
	readonly input : Input;
	readonly ui : Ui;

	private shape! : Shape;
	private nextShape! : Shape;
	private nextType! : ShapeType;

	private tutorial : boolean = false;
	private paused : boolean = false;
	private ended : boolean = false;

	private canvas = <HTMLCanvasElement> $('canvas');
	private ctx : CanvasRenderingContext2D;

	private nextCanvas = <HTMLCanvasElement> $('next');
	private nextCtx : CanvasRenderingContext2D;

	private lastTick : number = 0;

	constructor() {
		super();

		this.grid = new Grid();
		this.grid.on('row', () => this.addScore(888));
		this.grid.on('combo', () => this.addScore(2222));
		this.grid.on('supercombo', (rows) => this.addScore(4444 * rows));

		this.input = new Input();
		this.input.on('down', () => this.handleInput(() => this.shape.drop()));
		this.input.on('left', () => this.handleInput(() => this.shape.move(-1)));
		this.input.on('right', () => this.handleInput(() => this.shape.move(1)));
		this.input.on('up', () => this.handleInput(() => this.shape.rotate()));
		this.input.on('esc', () => this.handleInput(() => this.togglePause(), true));

		const ctx = this.canvas.getContext('2d');
		if (!ctx) throw new Error('Could not create rendering context');
		this.ctx = ctx;

		const nextCtx = this.nextCanvas.getContext('2d');
		if (!nextCtx) throw new Error('Could not create rendering context');
		this.nextCtx = nextCtx;

		this.ui = new Ui(this);
		this.ui.on('tutorial', (t) => this.tutorial = t);

		this.createNextShape();
		this.spawnNextShape();
	}

	start() {
		if (this.lastTick > 0) return;
		this.ui.init();
		this.loop();
	}

	private gameOver() {
		this.ended = true;
		this.input.once('space', () => {
			document.body.classList.add('reloading');
			setTimeout(() => window.location.reload(), 200);
		});
		this.emit('gameover');
	}

	private handleInput(callback : Function, allowWhenPaused : boolean = false) {
		if (this.tutorial || this.ended) return;
		if (this.paused && !allowWhenPaused) return;

		callback();
	}

	private togglePause() {
		this.paused = !this.paused;
		this.emit('paused', this.paused);
	}

	private addScore(score : number) {
		this.score += score + (0.04 * this.grid.height);
		this.emit('score', this.score);
	}

	private spawnNextShape() {
		this.input.clear();

		this.shape = new Shape(this, this.nextType);
		this.createNextShape();

		this.shape.on('drop', () => this.addScore(4));
		this.shape.once('collision', () => this.gameOver());

		this.shape.once('dropped', () => {
			this.addScore(44);
			this.grid.findCompleteRows();
			this.spawnNextShape();
		});


	}

	private createNextShape() {
		let type = ShapeType.random();
		if (this.shape) {
			while (type === this.shape.type) type = ShapeType.random();
		}
		this.nextType = type;

		const previewType = new ShapeType(type.blocks, Colour.GRAY);
		this.nextShape = new Shape(this, previewType, new Point(0, 0));

		this.nextCanvas.classList.remove('slidein');
		this.nextCanvas.classList.add('slideout');

		setTimeout(() => {
			this.nextCtx.clearRect(0, 0, 80, 80);
			this.nextShape.draw(this.nextCtx);

			this.nextCanvas.classList.add('slidein');
			this.nextCanvas.classList.remove('slideout');
		}, 250);
	}

	private loop() {
		const t = Date.now();
		if (t - this.lastTick > (1000 / TICKS_PER_SEC)) {
			this.tick();
			this.lastTick = t;
		}

		this.draw();

		window.requestAnimationFrame(() => this.loop());
	}

	private tick() {
		if (this.paused || this.ended || this.tutorial) return;
		if (this.shape.isActive) this.shape.drop();
	}

	private draw() {
		if (this.paused && this.ctx.globalAlpha > 0.2) this.ctx.globalAlpha -= 0.1;
		else if (!this.paused && this.ctx.globalAlpha < 1) this.ctx.globalAlpha += 0.1;

		// Draw the game
		this.ctx.clearRect(0, 0, this.grid.width * SQUARE_SIZE, this.grid.height * SQUARE_SIZE);

		this.ctx.save();
		this.ctx.globalAlpha *= 0.85;
		this.grid.forEach((tile) => {
			tile.draw(this.ctx);
		});

		this.ctx.restore();
		this.shape.draw(this.ctx);

		this.ui.update();
	}
}
