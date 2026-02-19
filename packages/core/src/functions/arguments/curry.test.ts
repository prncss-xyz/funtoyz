import { curry, curry2, curry2_1 } from './curry'

describe('curry', () => {
	test('base', () => {
		const fn = curry2((x: number, s: string) => x - s.length)
		expect(fn(5, 'four')).toBe(1)
		expect(fn('four')(5)).toBe(1)
	})
	test('curry3', () => {
		const fn = curry2_1((a: number, b: number, c: number) => a + b + c)
		expect(fn(1, 2, 3)).toBe(6)
		expect(fn(1, 2)(3)).toBe(6)
	})
})

describe('curry', () => {
	test('', () => {
		const f = (x: number, y: number, z: string) => x + y + z.length
		const t = curry(f)
		expect(t(5, 6, 'four')).toBe(15)
		expect(t(5)(6, 'four')).toBe(15)
		expect(t(5, 6)('four')).toBe(15)
		expect(t(5)(6)('four')).toBe(15)
	})
})
