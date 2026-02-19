import { id } from '../basics'
import { fromInit, Init, toInit } from './init'

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
