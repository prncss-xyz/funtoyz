import { curry2, curry2_1 } from './curry'

describe('curry', () => {
	test('curry2', () => {
		const fn = curry2((x: number, s: string) => x - s.length)
		expect(fn(5, 'four')).toBe(1)
		expect(fn('four')(5)).toBe(1)
	})
	test('curry2_1', () => {
		const fn = curry2_1((a: number, b: number, c: number) => a + b + c)
		expect(fn(1, 2, 3)).toBe(6)
		expect(fn(1, 2)(3)).toBe(6)
	})
})
