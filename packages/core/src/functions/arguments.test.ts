import { curry2, curry3, fromInit, Init, negate, toInit } from './arguments'
import { id } from './basics'
import { eq } from './elementary'

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

describe('toInit', () => {
	test('value', () => {
		expect(toInit(1)()).toBe(1)
	})
	test('function', () => {
		expect(toInit(id<number>)(1)).toBe(1)
	})
})

describe('curry', () => {
	test('base', () => {
		const fn = curry2((x: number, s: string) => x - s.length)
		expect(fn(5, 'four')).toBe(1)
		expect(fn('four')(5)).toBe(1)
	})
	test('curry3', () => {
		const fn = curry3((a: number, b: number, c: number) => a + b + c)
		expect(fn(1, 2, 3)).toBe(6)
		expect(fn(1, 2)(3)).toBe(6)
	})
})

describe('negate', () => {
	test('base', () => {
		const n = negate(eq(3))
		expect(n(3)).toBeFalsy()
	})
})
