export function formatScore(score : number) : string {
	return score.toFixed(0);
	/*return Array.from(score.toFixed(0))
		.reverse()
		.map((char, i) => i % 3 === 0 ? char + ' ' : char)
		.reverse()
		.join('');*/
}
