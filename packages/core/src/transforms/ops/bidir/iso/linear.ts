import { iso } from '.'

export function linear(m: number, b = 0) {
	return iso({
		get: (x: number) => m * x + b,
		set: (y) => (y - b) / m,
	})
}
