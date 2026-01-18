import { merge } from './merge'

describe('merge', () => {
	test('basic', () => {
		expect(merge({ b: 3 }, { a: 1, b: 2 })).toEqual({ a: 1, b: 3 })
	})
	test('preserve reference when equal', () => {
		const a = { a: 1 }
		expect(merge({}, a)).toBe(a)
		expect(merge({ a: 1 }, a)).toBe(a)
	})
	test('curried', () => {
		const res = merge({ b: 3 })({ a: 1, b: 2 })
		expect(res).toEqual({ a: 1, b: 3 })
	})
})
