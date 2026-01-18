import { eq } from '../../functions/elementary'
import { curry2, fromInit, Init, negate } from './arguments'

describe('fromInit', () => {
	type I = Init<number, [number, string]>
	test('with constant', () => {
		const v: I = 1
		expect(fromInit<number, [number, string]>(v, 2, 'toto')).toBe(1)
	})
	test('with function', () => {
		const f: I = (x: number, y: string) => x + y.length
		expect(fromInit<number, [number, string]>(f, 2, 'toto')).toBe(6)
	})
})

describe('curry', () => {
	test('base', () => {
		const fn = curry2((x: number, s: string) => x - s.length)
		expect(fn(5, 'four')).toBe(1)
		expect(fn('four')(5)).toBe(1)
	})
})

describe('negate', () => {
	test('base', () => {
		const n = negate(eq(3))
		expect(n(3)).toBeFalsy()
	})
})
