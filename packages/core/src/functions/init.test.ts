import { id } from './basics'
import { fromInit, toInit } from './init'

describe('fromInit', () => {
	test('value', () => {
		expect(fromInit(1, 2)).toBe(1)
	})
	test('function', () => {
		expect(fromInit(id, 2)).toBe(2)
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
