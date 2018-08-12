export const BLOCK_I = createCanvas(32, 32, (ctx) => {
	ctx.fillStyle = 'cornflowerblue';
	ctx.beginPath();
	ctx.lineTo(0, 8);
	ctx.lineTo(0, 16);
	ctx.lineTo(32, 16);
	ctx.lineTo(32, 8);
	ctx.fill();
});

export const ENEMY = createCanvas(14, 16, (ctx) => {
	ctx.fillStyle = 'crimson';
	ctx.beginPath();
	ctx.lineTo(14, 8);
	ctx.lineTo(0, 16);
	ctx.lineTo(0, 0);
	ctx.fill();
});

export const BULLET = createCanvas(5, 5, (ctx) => {
	ctx.fillStyle = 'white';
	ctx.beginPath();
	ctx.arc(5, 5, 5, 0, 2 * Math.PI);
	ctx.fill();
});

export const WALL = createCanvas(40, 40, (ctx) => {
	ctx.fillStyle = '#333333';
	ctx.fillRect(0, 0, 40, 40);
});

export const GROUND = createCanvas(40, 40, (ctx) => {
	ctx.fillStyle = '#666666';
	ctx.fillRect(0, 0, 40, 40);
});

export const GATE = createCanvas(20, 20, (ctx) => {
	ctx.fillStyle = '#111111';
	ctx.fillRect(0, 14, 40, 12);
});


type RenderCallback = (ctx : CanvasRenderingContext2D) => void;
function createCanvas(width : number, height : number, render : RenderCallback) : HTMLCanvasElement {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not create drawing context');

	render(ctx);

	return canvas;
}
