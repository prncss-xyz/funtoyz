import { lens } from '../lens'

export function dedupe<Whole>(areEqual = Object.is) {
	return lens<Whole, Whole>({
		get: (w) => w,
		set: (next, last) => (areEqual(next, last) ? last : next),
	})
}
